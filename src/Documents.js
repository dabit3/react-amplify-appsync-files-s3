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
import { Auth } from 'aws-amplify';
import SignDocument from './components/SignDocument'

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

const initialState = {
  documents: [],
  signeddocuments: []
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

var username = ""

function App() {
  Auth.currentSession().then(res=>{
    let accessToken = res.getAccessToken()
    let jwt = accessToken.getJwtToken()
    //You can print them to see the full objects
    //console.log(`myAccessToken: ${JSON.stringify(accessToken)}`)
    //console.log(`myJwt: ${jwt}`)
    let accesstokenstring = JSON.stringify(accessToken);
    let accessbreak1 = accesstokenstring.split(`username":"`);
    let accessbreak2 = accessbreak1[1].split(`"}}`)
    username = accessbreak2[0];
    console.log(`username: ${username}`)
  })
  const [imageURL, setImageURL] = useState(null) // create a state that will contain our image url
  const sigCanvas = useRef({}) //create a ref using react useRef hook
  const [file, updateFile] = useState(null)
  const [docname, updateDocname] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  const [documentUrl, updateDocumentUrl] = useState('')
  const [documentOpen, setDocumentOpen] = useState(false);

  
    /* a function that uses the canvas ref to clear the canvas via a method given by react-signature-canvas
  */
 const clear = () => sigCanvas.current.clear();

  function handleChange(event) {
    const { target: { value, files } } = event
    const [image] = files || []
    updateFile(image || value)
  }

  async function fetchImage(key) {
    //
    try {
      const imageData = await Storage.get(key)
      updateDocumentUrl(imageData)
      setDocumentOpen(true);
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
     * TODO: get active document open and write to local storage
     * TODO: get active signature open and write to local storage
     * TODO: combine two files and create new signeddocument
     * TODO: upload signeddocument to S3
     */
    console.log("signing document")
    //draggableSignature - add user's signature
    //signDoc - add button to sign document
  }

  async function createSignature() {
    //TODO: update div with draggable signature
    // draggableSignature

    const key = `${uuid()}-${username}-signature.png`
    const fileForUpload = {
        bucket,
        key,
        region,
    }
    const inputData = { username: username, sigimage: fileForUpload }
    let buf = Buffer.from(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png").replace(/^data:image\/\w+;base64,/, ""),'base64')
    try {
      await Storage.put(key, buf, {
        ContentType: 'image/png',
        ContentEncoding: 'base64'
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
    <div class="leftCol">
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
                onClick={() => fetchImage(u.docimage.key)}>{u.docname}&nbsp;<button>Delete</button></p>
                
            </div>
          )
        })
      }
      <div id="currentDoc">
      { documentOpen ? <SignDocument></SignDocument> : <></> }
      <img
        src={documentUrl}
        style={{ width: 1000 }}
      />
      </div>
      </div>
      <div class="rightCol">
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
            float:"right",
            border: "1px solid black",
            width: "150px"
          }}
        />
      ) : null}
    </div>
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
    display:'inline-block'
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