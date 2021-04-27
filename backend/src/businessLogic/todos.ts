// Contains all business logic to work with groups in our application

// import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'

// all code that works with DynamoDB is encapsulated in the dataLayer called TodoAccess
const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {

  const userId = parseUserId(jwtToken);

  return todoAccess.getTodos(userId)
}

// export async function createTodo(
//   createGroupRequest: CreateTodoRequest,
//   jwtToken: string
// ): Promise<TodoItem> {

//   const itemId = uuid.v4()
//   const userId = parseUserId(jwtToken)

//   return await todoAccess.createTodo({
//     id: itemId,
//     userId: userId,
//     name: createGroupRequest.name,
//     description: createGroupRequest.description,
//     timestamp: new Date().toISOString(),
//     timestamp2: new Date().toISOString(),
//     newField: "to test",
//     newField2: "Canary10Percent30Minutes"
//   })
// }
