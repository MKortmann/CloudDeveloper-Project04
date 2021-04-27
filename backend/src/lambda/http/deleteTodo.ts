import 'source-map-support/register'
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	APIGatewayProxyHandler
} from 'aws-lambda'

import { createLogger } from '../../utils/logger'

import { deleteTodo } from '../../businessLogic/todos'
import { getToken } from '../utils'

const logger = createLogger('deleteTodo')

export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const todoId = event.pathParameters.todoId

	logger.info('At delete lambda function', {
		event
	})

	const jwtToken = getToken(event)
	const result = await deleteTodo(jwtToken, todoId)

	return {
		statusCode: result.statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		body: result.body
	}
}
