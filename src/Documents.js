import React, { useState, useReducer, useEffect } from 'react'
import { withAuthenticator } from 'aws-amplify-react'
import { Storage, API, graphqlOperation } from 'aws-amplify'
import { createDocument as CreateDocument } from './graphql/mutations'
import { listDocuments } from './graphql/queries'
import { onCreateDocument } from './graphql/subscriptions'
import config from './aws-exports'
import uuid from 'uuid/v4'

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

const initialState = {
  documents: []
}

function reducer(state, action) {
  switch(action.type) {
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.documents }
    case 'ADD_DOCUMENT':
      return { ...state, documents: [action.document, ...state.documents] }
    default:
      return state
  }
}

function App() {
  const [file, updateFile] = useState(null)
  const [docname, updateDocname] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  const [documentUrl, updateDocumentUrl] = useState('')

  function handleChange(event) {
    const { target: { value, files } } = event
    const [image] = files || []
    updateFile(image || value)
  }

  async function fetchImage(key) {
    try {
      const imageData = await Storage.get(key)
      updateDocumentUrl(imageData)
    } catch(err) {
      console.log('error: ', err)
    }
  }

  async function fetchDocuments() {
    try {
     let documents = await API.graphql(graphqlOperation(listDocuments))
     documents = documents.data.listDocuments.items
     dispatch({ type: 'SET_DOCUMENTS', documents })
    } catch(err) {
      console.log('error fetching documents')
    }
  }

  async function createDocument(event) {
    event.preventDefault()
    if (!docname) return alert('please enter a document name')
    if (file && docname) {
        const { name: fileName, type: mimeType } = file  
        const key = `${uuid()}${fileName}`
        const fileForUpload = {
            bucket,
            key,
            region,
        }
        const inputData = { docname, docimage: fileForUpload }

        try {
          await Storage.put(key, file, {
            contentType: mimeType
          })
          await API.graphql(graphqlOperation(CreateDocument, { input: inputData }))
          updateDocname('')
          console.log('successfully stored document data!')
        } catch (err) {
          console.log('error: ', err)
        }
    }
  }
  useEffect(() => {
    fetchDocuments()
    const subscription = API.graphql(graphqlOperation(onCreateDocument))
      .subscribe({
        next: async documentData => {
          const { onCreateDocument } = documentData.value.data
          dispatch({ type: 'ADD_DOCUMENT', document: onCreateDocument })
        }
      })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div style={styles.container}>
      <input
        label="File to upload"
        type="file"
        onChange={handleChange}
        style={{margin: '10px 0px'}}
      />
      <input
        placeholder='Document name'
        value={docname}
        onChange={e => updateDocname(e.target.value)}
      />
      <button
        style={styles.button}
        onClick={createDocument}>Save Document</button>
      {
        state.documents.map((u, i) => {
          return (
            <div
              key={i}
            >
              <p
                style={styles.docname}
               onClick={() => fetchImage(u.docimage.key)}>{u.docname}</p>
            </div>
          )
        })
      }
      <img
        src={documentUrl}
        style={{ width: 300 }}
      />
    </div>
  )

  // async function fetchAllImages() {
  //   try {
  //    // fetch all items from DB
  //    let users = await API.graphql(graphqlOperation(listUsers))
  //    users = users.data.listUsers.items
  //    // create Amazon S3 api calls for items in list
  //    const userRequests = users.map(u => Storage.get(u.avatar.key))
  //    // get signed Image URLs from S3 for each item in array by making the API call
  //    const userData = await(Promise.all(userRequests))
  //    // add new signed url to each item in array
  //    users.forEach((u, i) => {
  //      u.avatarUrl = userData[i]
  //    })
  //    dispatch({ type: 'SET_USERS', users })
  //   } catch(err) {
  //     console.log('error fetching users')
  //   }
  // }
}

const styles = {
  container: {
    width: 300,
    margin: '0 auto'
  },
  docname: {
    cursor: 'pointer',
    border: '1px solid #ddd',
    padding: '5px 25px'
  },
  button: {
    width: 200,
    backgroundColor: '#ddd',
    cursor: 'pointer',
    height: 30,
    margin: '0px 0px 8px'
  }
}

export default withAuthenticator(App, { includeGreetings: true })