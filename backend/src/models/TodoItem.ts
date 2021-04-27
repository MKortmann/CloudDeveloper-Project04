/**
 * Contains a structure of the data that we store in our DynamoDB table
 */
export interface TodoItem {
	userId: string
	todoId: string
	createdAt: string
	name: string
	dueDate: string
	done: boolean
	attachmentUrl?: string
}
