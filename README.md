## File uploads and downloads with React, AWS Amplify, AWS AppSync, and Amazon S3

This is an example project showing how to upload and download files and images using AWS Amplify, AWS AppSync, and Amazon S3. This example also shows how to use signature canvas and merge-images to upload and create signed documents and store these signed documents in Amazon S3.

### The question

How do I upload images and files using GraphQL with AWS AppSync?

### The solution

There are a few parts to this solution:

* You must first upload the image to a storage solution (in this example, Amazon S3)
* After you have finished uploading the image, you will need to store a reference to this image in a database using a GraphQL mutation.
* When you want to view a public image (public bucket), you need to:
  * Query the image URL from your database using GraphQL
* When you want to view a private image (non-public bucket), you need to do two things:
  * First, query the image reference from your database using GraphQL
  * Get a signed URL for the image from S3

## To deploy this app

### Amplify CLI

1. Clone the project and change into the directory

```sh
git clone https://github.com/sarahvardyrsi/react-amplify-appsync-files-s3.git

cd react-amplify-appsync-s3
```

2. Install the dependencies

```sh
npm install

# or

yarn
```

3. Initialize and deploy the amplify project

```sh
amplify init

amplify push
```

4. Run the app

```sh
npm start
```

5. Change the bucket policy [in your S3 bucket](https://s3.console.aws.amazon.com/s3/home) for files in the `images` folder to be public (in order for the Product images to be publicly viewable):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<YOUR_BUCKET_NAME>/public/images/*"
        }
    ]
}
```

### Amplify Console

Click the button to deploy this application to the Amplify console.

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/sarahvardyrsi/react-amplify-appsync-files-s3.git)

Then change the bucket policy [in your S3 bucket](https://s3.console.aws.amazon.com/s3/home) for files in the `images` folder to be public (in order for the Product images to be publicly viewable):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<YOUR_BUCKET_NAME>/public/images/*"
        }
    ]
}
```