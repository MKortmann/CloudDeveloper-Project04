// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

// need to write items to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();

// get the todo table name to save the item
const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("At create function");
  // getting the body
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)

  // creating a new uuid for this Todo Item
  const id = uuid.v4();

  // new todo
  const todoItem = {
    id,
    ...parsedBody
  }

  console.log("item created:", todoItem)

  // add this to dynamoDB
  await docClient.put({
    TableName: todosTable,
    Item: todoItem
  }).promise()

  // Return result
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      todoItem
    })
  }

}
