/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateDocument = /* GraphQL */ `
  subscription OnCreateDocument {
    onCreateDocument {
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
export const onUpdateDocument = /* GraphQL */ `
  subscription OnUpdateDocument {
    onUpdateDocument {
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
export const onDeleteDocument = /* GraphQL */ `
  subscription OnDeleteDocument {
    onDeleteDocument {
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
export const onCreateSignature = /* GraphQL */ `
  subscription OnCreateSignature {
    onCreateSignature {
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
export const onUpdateSignature = /* GraphQL */ `
  subscription OnUpdateSignature {
    onUpdateSignature {
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
export const onDeleteSignature = /* GraphQL */ `
  subscription OnDeleteSignature {
    onDeleteSignature {
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
export const onCreateSignedDocument = /* GraphQL */ `
  subscription OnCreateSignedDocument {
    onCreateSignedDocument {
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
export const onUpdateSignedDocument = /* GraphQL */ `
  subscription OnUpdateSignedDocument {
    onUpdateSignedDocument {
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
export const onDeleteSignedDocument = /* GraphQL */ `
  subscription OnDeleteSignedDocument {
    onDeleteSignedDocument {
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
