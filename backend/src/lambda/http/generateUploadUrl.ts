// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger';

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const s3Bucket = process.env.TODOS_IMAGES_S3_BUCKET;
const urlExpiration = process.env.TODOS_SIGNED_URL_EXPIRATION;
const logger = createLogger('generateUploadUrls');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing generateUploadUrl Event: ', {
    event
  })

  const todoId = event.pathParameters.todoId

  const url = s3.getSignedUrl('putObject', {
    Bucket: s3Bucket,
    Key: todoId,
    Expires: urlExpiration
  })

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}
