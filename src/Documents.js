import React, { useState, useReducer, useEffect, useRef } from 'react'
import { withAuthenticator } from 'aws-amplify-react'
import { Storage, API, graphqlOperation } from 'aws-amplify'
import { createDocument as CreateDocument } from './graphql/mutations'
import { listDocuments } from './graphql/queries'
import { onCreateDocument } from './graphql/subscriptions'
import { createSignature as CreateSignature } from './graphql/mutations'
import { listSignatures } from './graphql/queries'
import { onCreateSignature } from './graphql/subscriptions'
import config from './aws-exports'
import uuid from 'uuid/v4'
import Popup from "reactjs-popup";
import SignaturePad from "react-signature-canvas";
import './sigCanvas.css';

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

const initialState = {
  documents: []
}

var currentDocOpen = [];

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
  const [imageURL, setImageURL] = useState(null) // create a state that will contain our image url
  const sigCanvas = useRef({}) //create a ref using react useRef hook
  const [file, updateFile] = useState(null)
  const [docname, updateDocname] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  const [documentUrl, updateDocumentUrl] = useState('')

    /* a function that uses the canvas ref to clear the canvas via a method given by react-signature-canvas
  */
 const clear = () => sigCanvas.current.clear();

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
  async function createSignedDocument(event) {
    /* TODO: use Lambda SHARP image transforms to perform image merging - document signing and store on S3
     * TODO: store the s3 object graphql 
     */
  }

  async function createSignature(event) {
        const { type: mimeType } = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
        const key = `${uuid()}-signature`
        const fileForUpload = {
            bucket,
            key,
            region,
        }
        const inputData = { sigimage: fileForUpload }
        try {
          await Storage.put(key, sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"), {
            contentType: mimeType
          })
          await API.graphql(graphqlOperation(CreateSignature, { input: inputData }))
          console.log('successfully stored signature data!')
        } catch (err) {
          console.log('error: ', err)
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
            <div id={u.docimage.key}
              key={i}
            >
              <p
                style={styles.docname}
               onClick={() => fetchImage(u.docimage.key)}>{u.docname}</p>
            </div>
          )
        })
      }
      <div id="currentDoc">
      <img
        src={documentUrl}
        style={{ width: 300 }}
      />
      </div>
      <h1>Create a signature</h1>
      <Popup 
        modal 
        trigger={<button>Open Signature Pad</button>}
        closeOnDocumentClick={false}
      >
        {close => (
          <>
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{
              className: "signatureCanvas"
            }}
          />
          <button onClick={createSignature}>Save</button>
          <button onClick={clear}>clear</button>
          <button onClick={close}>close</button>
          </>
        )}
      </Popup>
      <br />
      <br />
      { imageURL ? (
        <img
          src={imageURL}
          alt="my signature"
          style= {{
            display: "block",
            margin: "0 auto",
            border: "1px solid black",
            width: "150px"
          }}
        />
      ) : null}
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