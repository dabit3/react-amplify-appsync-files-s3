import React, { useEffect, useState } from 'react';
import { Storage, API, graphqlOperation } from 'aws-amplify'
import uuid from 'uuid/v4'
import { withAuthenticator } from 'aws-amplify-react'

import { createProduct as CreateProduct } from './graphql/mutations'
import { listProducts as ListProducts } from './graphql/queries'
import config from './aws-exports'

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

function App() {
  const [file, updateFile] = useState(null)
  const [productName, updateProductName] = useState('')
  const [products, updateProducts] = useState([])
  useEffect(() => {
    listProducts()
  }, [])

  async function listProducts() {
    const products = await API.graphql(graphqlOperation(ListProducts))
    updateProducts(products.data.listProducts.items)
  }

  function handleChange(event) {
    const { target: { value, files } } = event
    const fileForUpload = files[0]
    updateProductName(fileForUpload.name.split(".")[0])
    updateFile(fileForUpload || value)
  }

  async function createProduct(event) {
    event.preventDefault()
    if (file) {
      const extension = file.name.split(".")[1]
      const { type: mimeType } = file
      const key = `images/${uuid()}${productName}.${extension}`      
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
      const inputData = { name: productName , image: url }
      
      try {
        await Storage.put(key, file, {
          contentType: mimeType
        })
        await API.graphql(graphqlOperation(CreateProduct, { input: inputData }))
        console.log('successfully created product!')
      } catch (err) {
        console.log('error: ', err)
      }
    }
  }

  return (
    <div style={styles.container}>
      <input
        type="file"
        onChange={handleChange}
        style={{margin: '10px 0px'}}
      />
      <input
        placeholder='Product Name'
        value={productName}
        onChange={e => updateProductName(e.target.value)}
      />
      <button
        style={styles.button}
        onClick={createProduct}>Create Product</button>

      {
        products.map((p, i) => (
          <img
            style={styles.image}
            key={i}
            src={p.image}
          />
        ))
      }
    </div>
  );
}

const styles = {
  container: {
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  image: {
    width: 400
  },
  button: {
    width: 200,
    backgroundColor: '#ddd',
    cursor: 'pointer',
    height: 30,
    margin: '0px 0px 8px'
  }
}

export default withAuthenticator(App);
