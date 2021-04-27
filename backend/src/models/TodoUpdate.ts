/**
 * Contains a structure of the data that we update in our DynamoDB table
 */
export interface TodoUpdate {
	name: string
	dueDate: string
	done: boolean
}
