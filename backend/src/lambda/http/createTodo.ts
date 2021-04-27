// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createTodo } from '../../businessLogic/todos'

import { createLogger } from '../../utils/logger';


const logger = createLogger('createTodo');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing createTodo Event: ', {
    event
  })
  // getting the body
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)

  // to get the user id
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const item = await createTodo(jwtToken, parsedBody);

  logger.info("item created", item)

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
