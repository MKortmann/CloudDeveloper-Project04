// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger';

import { deleteTodo } from '../../businessLogic/todos';

const logger = createLogger('deleteTodo');

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


  const result = await deleteTodo(jwtToken, todoId);


  return {
    statusCode: result.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: result.body
  }


}
