// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger';
import { parseUserId } from '../../auth/utils';

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const s3Bucket = process.env.TODOS_IMAGES_S3_BUCKET;
const urlExpiration = process.env.TODOS_SIGNED_URL_EXPIRATION;
const logger = createLogger('generateUploadUrls');

// get the todo table name to save the item
const todosTable = process.env.TODOS_TABLE;

const docClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing generateUploadUrl Event: ', {
    event
  })

  const todoId = event.pathParameters.todoId

  // to get the user id
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken);
  console.log("userId", userId)

  // let todoToBeUpdate = await docClient.query({
  //   TableName: todosTable,
  //   KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
  //   ExpressionAttributeValues: {
  //     ':userId': userId,
  //     ':todoId': todoId
  // }
  // }).promise()

  // if(todoToBeUpdate.Items.length === 0) {
  //   return {
  //     statusCode: 404,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     body: 'The item to be update was not found'
  //   }
  // }

  await docClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: "set #attachmentUrl =:attachmentUrl",
    ExpressionAttributeValues: {
      ":attachmentUrl": `https://${s3Bucket}.s3.amazonaws.com/${todoId}`,
    },
    ExpressionAttributeNames: {"#attachmentUrl": "attachmentUrl"},
    ReturnValues: "UPDATED_NEW"
  }).promise()

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
