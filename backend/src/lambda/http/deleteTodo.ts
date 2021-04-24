// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();

const todosTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  // const result = await docClient.query({
  //   TableName: todosTable,
  //   Key:
  // })

  const result = await docClient.delete({
    TableName: todosTable,
    Key: {
      id: todoId
    },
  }).promise()

  // TODO!!!!!!!!!!!
  // we need to delete the image in S3 buckt if it is there


  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: "item was deleted: " + JSON.stringify(result)
  }


}
