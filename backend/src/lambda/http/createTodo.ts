import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('createTodo')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		logger.info('Processing createTodo Event: ', {
			event
		})

		const parsedBody: CreateTodoRequest = JSON.parse(event.body)
		const jwtToken = getToken(event)

		const item = await createTodo(jwtToken, parsedBody)

		logger.info('item created', item)

		return {
			statusCode: 201,
			body: JSON.stringify({
				item
			})
		}
	}
)

handler.use(
	cors({
		credentials: true
	})
)
