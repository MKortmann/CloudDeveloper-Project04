import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from 'aws-sdk';

import { createLogger } from '../../utils/logger';
import { parseUserId } from '../../auth/utils';

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

  // to get the user id
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken);
  console.log("userId", userId)

  let todoToBeUpdate = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':todoId': todoId
  }
  }).promise()


  if(todoToBeUpdate.Items.length === 0) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: 'The item to be update was not found'
    }
  }

  await docClient.update({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: "set #name =:name, #dueDate=:dueDate, #done=:done",
    ExpressionAttributeValues: {
      ":name": updatedTodo.name,
      ":dueDate": updatedTodo.dueDate,
      ":done": updatedTodo.done
    },
    ExpressionAttributeNames: {"#name": "name", "#dueDate": "dueDate", "#done": "done"},
    ReturnValues: "UPDATED_NEW"
  }).promise()


  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // body: "Item updated" + JSON.stringify(todoUpdated)
    body: ''
  }
}
