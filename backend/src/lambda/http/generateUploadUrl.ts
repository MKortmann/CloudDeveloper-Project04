// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { generateUploadUrl } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getToken } from '../utils';


const logger = createLogger('generateUploadUrls');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing generateUploadUrl Event: ', {
    event
  })

  const todoId = event.pathParameters.todoId

  const jwtToken = getToken(event);

  const result = await generateUploadUrl(jwtToken, todoId)

  // return a presigned URL to upload a file for a TODO item with the provided id
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
