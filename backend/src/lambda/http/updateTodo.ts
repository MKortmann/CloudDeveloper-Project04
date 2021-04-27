import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updatedTodo } from '../../businessLogic/todos'

import { createLogger } from '../../utils/logger';

const logger = createLogger('updateTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const parsedBody: UpdateTodoRequest = JSON.parse(event.body);

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

  const result = await updatedTodo(jwtToken, todoId, parsedBody);

  return {
    statusCode: result.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: result.body
  }
}
