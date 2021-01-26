import React, { useState, useReducer, useEffect, useRef } from 'react'
import { withAuthenticator } from 'aws-amplify-react'
import { Storage, API, graphqlOperation } from 'aws-amplify'
import { createDocument as CreateDocument } from './graphql/mutations'
import { listDocuments } from './graphql/queries'
import { onCreateDocument } from './graphql/subscriptions'
import { createSignedDocument as CreateSignedDocument } from './graphql/mutations'
import { listSignedDocuments } from './graphql/queries'
import { onCreateSignedDocument } from './graphql/subscriptions'
import config from './aws-exports'
import uuid from 'uuid/v4'
import Popup from "reactjs-popup";
import SignaturePad from "react-signature-canvas";
import './sigCanvas.css';
import mergeImages from 'merge-images';

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
  const [imageURL, setImageURL] = useState(null); // create a state that will contain our image url
  const sigCanvas = useRef({}); //create a ref using react useRef hook
  const [file, updateFile] = useState(null)
  const [docname, updateDocname] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  const [documentUrl, updateDocumentUrl] = useState('')

    /* a function that uses the canvas ref to clear the canvas via a method given by react-signature-canvas
  */
 const clear = () => sigCanvas.current.clear();

  /*function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
  }*/

  async function upload() {
    console.log(documentUrl);
    /*const download = require('image-downloader')

    const options = {
      url: documentUrl,
      dest: '/tmpimg/tmpdoc'                // will be saved to /path/to/dest/image.jpg
    }

    download.image(options)
      .then(({ filename }) => {
        console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
      })
      .catch((err) => console.error(err))*/
    //var docOpen = document.getElementById('currentDoc');
    //var myimg = docOpen.getElementsByTagName('img')[0];
    var mysrc1 = documentUrl.split("public/");
    var mysrc2 = mysrc1[1].split("?");
    //console.log(mysrc2[0]);
    var awsimg = new Image();
    //document.write();
    try {
      const imageData = await Storage.get(mysrc2[0])
      awsimg = imageData.Body
      alert("Loaded " + imageData.ContentLength + " bytes");
    } catch(err) {
      console.log('error: ', err)
    }
    /*var s3 = new config.S3();
    s3.getObject(
      { Bucket: bucket, Key: mysrc2[0] },
      function (error, data) {
        if (error != null) {
          alert("Failed to retrieve an object: " + error);
        } else {
          alert("Loaded " + data.ContentLength + " bytes");
          // do something with data.Body
          awsimg = data.Body;
        }
      }
    );*/
    try {
      //awsimg = fetchImage(mysrc2[0]);
      //awsimg.src = documentUrl;
      let sigimg = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      //var mergedDoc = new Image();
      //mergedDoc = mergeImages([awsimg, sigimg]).then(b64 => document.querySelector('img').src = b64);;
        //const { name: fileName, type: mimeType } = sigCanvas.current.getTrimmedCanvas().toDataURL("image/jpeg");
      let mergedDoc = mergeImages(['/body.png', '/eyes.png', '/mouth.png']);
      /*const { name: fileName, type: mimeType } = mergedDoc;
      const key = `${uuid()}${fileName}`
      const fileForUpload = {
        bucket,
        key,
        region,
      }
      //const inputData = { docname, docimage: fileForUpload }
      await Storage.put(key, file, {
        contentType: mimeType
      })
      //setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));*/
      setImageURL(mergedDoc.toDataURL("image/png"));
    } catch (err) {
      console.log('error: ', err)
    }
  };

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
    event.preventDefault()
    if (file) {
        const { name: fileName, type: mimeType } = file  
        const key = `${uuid()}${fileName}`
        const fileForUpload = {
            bucket,
            key,
            region,
        }
        const inputData = { docimage: fileForUpload }

        try {
          await Storage.put(key, file, {
            contentType: mimeType
          })
          await API.graphql(graphqlOperation(CreateSignedDocument, { input: inputData }))
          console.log('successfully stored signed document data!')
        } catch (err) {
          console.log('error: ', err)
        }
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
        style={{ width: 1000 }}
      />
      </div>
      <h1>Signature Pad Example</h1>
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
          
          <button onClick={upload}>Save</button>
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