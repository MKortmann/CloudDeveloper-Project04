import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updatedTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('updateTodos')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		const todoId = event.pathParameters.todoId
		const parsedBody: UpdateTodoRequest = JSON.parse(event.body)

		logger.info('Getting an item to be updated: ', {
			event
		})
		logger.info('Item to be updated: ', {
			updatedTodo
		})

		const jwtToken = getToken(event)

		const result = await updatedTodo(jwtToken, todoId, parsedBody)

		return {
			statusCode: result.statusCode,
			body: result.body
		}
	}
)

handler.use(
	cors({
		credentials: true
	})
)
