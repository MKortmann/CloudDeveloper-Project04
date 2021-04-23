import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from 'aws-sdk';

import { createLogger } from '../../utils/logger';

const logger = createLogger('updateTodos');

const docClient = new AWS.DynamoDB.DocumentClient();

const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  logger.info('Getting an item to be updated: ', {
    event
  })
  logger.info('Item to be updated: ', {
    updatedTodo
  })

  let itemToBeUpdated = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': todoId
  }
  }).promise()

  // itemToBeUpdated = {...updatedTodo};

  // if(itemToBeUpdated.Count === 0) {
  //   return {
  //     statusCode: 404,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     body: 'The item to be update was not found'
  //   }
  // }


  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(itemToBeUpdated)
  }
}
