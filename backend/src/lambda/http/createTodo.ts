// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { parseUserId } from '../../auth/utils'
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import { createLogger } from '../../utils/logger';

// need to write items to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();

// get the todo table name to save the item
const todosTable = process.env.TODOS_TABLE;

const logger = createLogger('createTodo');

//s3Bucket for image url
// const s3Bucket = process.env.TODOS_IMAGES_S3_BUCKET;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing createTodo Event: ', {
    event
  })
  // getting the body
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)

  // creating a new uuid for this Todo Item
  const todoId = uuid.v4();

  // to get the user id
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken);

  logger.info("userId", userId);

  // new todo
  const item = {
    userId,
    todoId,
    createAt: new Date().toISOString(),
    done: false,
    ...parsedBody,
    attachmentUrl: ""
  }

  logger.info("item created", item)

  // add this to dynamoDB
  await docClient.put({
    TableName: todosTable,
    Item: item
  }).promise()

  // Return result
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }

}
