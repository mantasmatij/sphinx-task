import AWS from 'aws-sdk'
import stream from 'stream'
import fs from 'fs'

function uploadFileToS3 (filePath: string, bucketName: string, S3): stream.PassThrough {
  const passthrough = new stream.PassThrough()
  const params = {
    Bucket: bucketName,
    Key: filePath,
    Body: passthrough,
    ACL: 'public-read',
    ContentType: 'text/csv'
  }
  S3.upload(params, (err, data) => {
    if (err != null) {
      console.error('Error uploading file:', err)
    }
  }).on('httpUploadProgress', (progress: any) => {
    console.log('Progress:', progress)
  })
  return passthrough
}

export function uploadFile (filePath: string, bucketName: string): stream.PassThrough {
  AWS.config.credentials = new AWS.TemporaryCredentials({
    RoleSessionName: 'sphinx-session',
    RoleArn: process.env.AWS_ROLE_ARN,
    DurationSeconds: 900
  })
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
  const readStream = fs.createReadStream(filePath)
  return readStream.pipe(uploadFileToS3(filePath, bucketName, s3))
}
