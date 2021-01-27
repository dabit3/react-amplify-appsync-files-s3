/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getDocument = /* GraphQL */ `
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
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
export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getSignature = /* GraphQL */ `
  query GetSignature($id: ID!) {
    getSignature(id: $id) {
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
export const listSignatures = /* GraphQL */ `
  query ListSignatures(
    $filter: ModelSignatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSignatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getSignedDocument = /* GraphQL */ `
  query GetSignedDocument($id: ID!) {
    getSignedDocument(id: $id) {
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
export const listSignedDocuments = /* GraphQL */ `
  query ListSignedDocuments(
    $filter: ModelSignedDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSignedDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
