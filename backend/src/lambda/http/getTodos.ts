import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import 'source-map-support';

import { createLogger } from '../../utils/logger';

import { getTodos } from '../../businessLogic/todos'

const logger = createLogger('getTodos');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  logger.info('Processing getTodos Event: ', {
    event
  })

  // to get the user jwtToken from header
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const items = await getTodos(jwtToken);

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