/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      avatar {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      avatar {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      avatar {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const createDocument = /* GraphQL */ `
  mutation CreateDocument(
    $input: CreateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    createDocument(input: $input, condition: $condition) {
      id
      docname
      docimage {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateDocument = /* GraphQL */ `
  mutation UpdateDocument(
    $input: UpdateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    updateDocument(input: $input, condition: $condition) {
      id
      docname
      docimage {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteDocument = /* GraphQL */ `
  mutation DeleteDocument(
    $input: DeleteDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    deleteDocument(input: $input, condition: $condition) {
      id
      docname
      docimage {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const createSignature = /* GraphQL */ `
  mutation CreateSignature(
    $input: CreateSignatureInput!
    $condition: ModelSignatureConditionInput
  ) {
    createSignature(input: $input, condition: $condition) {
      id
      username
      sigimage {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateSignature = /* GraphQL */ `
  mutation UpdateSignature(
    $input: UpdateSignatureInput!
    $condition: ModelSignatureConditionInput
  ) {
    updateSignature(input: $input, condition: $condition) {
      id
      username
      sigimage {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteSignature = /* GraphQL */ `
  mutation DeleteSignature(
    $input: DeleteSignatureInput!
    $condition: ModelSignatureConditionInput
  ) {
    deleteSignature(input: $input, condition: $condition) {
      id
      username
      sigimage {
        bucket
        region
        key
      }
      createdAt
      updatedAt
    }
  }
`;
export const createSignedDocument = /* GraphQL */ `
  mutation CreateSignedDocument(
    $input: CreateSignedDocumentInput!
    $condition: ModelSignedDocumentConditionInput
  ) {
    createSignedDocument(input: $input, condition: $condition) {
      id
      signdocimage {
        bucket
        region
        key
      }
      username
      createdAt
      updatedAt
    }
  }
`;
export const updateSignedDocument = /* GraphQL */ `
  mutation UpdateSignedDocument(
    $input: UpdateSignedDocumentInput!
    $condition: ModelSignedDocumentConditionInput
  ) {
    updateSignedDocument(input: $input, condition: $condition) {
      id
      signdocimage {
        bucket
        region
        key
      }
      username
      createdAt
      updatedAt
    }
  }
`;
export const deleteSignedDocument = /* GraphQL */ `
  mutation DeleteSignedDocument(
    $input: DeleteSignedDocumentInput!
    $condition: ModelSignedDocumentConditionInput
  ) {
    deleteSignedDocument(input: $input, condition: $condition) {
      id
      signdocimage {
        bucket
        region
        key
      }
      username
      createdAt
      updatedAt
    }
  }
`;
