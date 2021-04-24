/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  createAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
