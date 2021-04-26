// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/logger';
import { parseUserId } from '../../auth/utils';

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({});
const logger = createLogger('deleteTodo');

const todosTable = process.env.TODOS_TABLE;
// used to delete the image
const s3Bucket = process.env.TODOS_IMAGES_S3_BUCKET;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  // deleting the image object
  logger.info('At delete lambda function', {
    event
  })

  // to get the user id
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken);
  console.log("userId", userId)

  let todoToBeDeleted = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':todoId': todoId
  }
  }).promise()


  if(todoToBeDeleted.Items.length === 0) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'The item to be deleted was not found'
    }
  }

  await docClient.delete({
    TableName: todosTable,
    Key: {
      userId,
      todoId
     }
    }).promise()


  await s3.deleteObject({
    Bucket: s3Bucket,
    Key: todoId
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }


}
