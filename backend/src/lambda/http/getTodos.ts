import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getTodos } from '../../businessLogic/todos'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getTodos')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		logger.info('Processing getTodos Event: ', {
			event
		})

		const jwtToken = getToken(event)
		const items = await getTodos(jwtToken)

		return {
			statusCode: 200,
			body: JSON.stringify({
				items
			})
		}
	}
)

handler.use(
	cors({
		credentials: true
	})
)
