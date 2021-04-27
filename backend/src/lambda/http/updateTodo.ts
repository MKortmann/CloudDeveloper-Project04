import 'source-map-support/register'
import {
	APIGatewayProxyEvent,
	APIGatewayProxyHandler,
	APIGatewayProxyResult
} from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updatedTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getToken } from '../utils'

const logger = createLogger('updateTodos')

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		body: result.body
	}
}
