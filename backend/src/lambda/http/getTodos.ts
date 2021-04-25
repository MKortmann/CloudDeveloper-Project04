import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import 'source-map-support';
import * as AWS from 'aws-sdk';

import { createLogger } from '../../utils/logger';
// import { parseUserId } from '../../auth/utils'

const logger = createLogger('getTodos');


const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  logger.info('Processing getTodos Event: ', {
    event
  })

  // to get the userId
  const authorization = event.headers.Authorization;
  console.log("Authorization", authorization)
  // const userId = parseUserId(authorization)

  // const result = await docClient.query({
  //   TableName: todosTable,
  //   IndexName: userId,
  //   KeyConditionExpression: 'userId = :userId',
  //   ExpressionAttributeValues: {
  //     ':userId': userId
  //   }
  // }).promise()
  const result = await docClient.scan({
    TableName: todosTable
  }).promise()

  const items = result.Items;

  // Return result
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}