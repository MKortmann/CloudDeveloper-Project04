// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { generateUploadUrl } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';


const logger = createLogger('generateUploadUrls');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing generateUploadUrl Event: ', {
    event
  })

  const todoId = event.pathParameters.todoId

  // to get the user id
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

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


  const result = await generateUploadUrl(jwtToken, todoId)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: result.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: result.body
    })
  }
}
