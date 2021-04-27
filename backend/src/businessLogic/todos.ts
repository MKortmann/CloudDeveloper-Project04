// Contains all business logic to work with groups in our application

import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger';

const logger = createLogger('todos')


// all code that works with DynamoDB is encapsulated in the dataLayer called TodoAccess
const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {

  const userId = parseUserId(jwtToken);

  return todoAccess.getTodos(userId)
}

export async function deleteTodo(jwtToken: string, todoId: string) {

  const userId = parseUserId(jwtToken);
  const toReturn = todoAccess.deleteItem(userId, todoId);

  return toReturn;
}

export async function createTodo(jwtToken: string, parsedBody: CreateTodoRequest) {

  const userId = parseUserId(jwtToken);
  const todoId = uuid.v4();

  logger.info("userId", userId);
  logger.info("todoId", todoId);

  // new todo
  const item = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...parsedBody,
    attachmentUrl: ""
  }

  logger.info("Item to be created at business logic", item);
  const toReturn = todoAccess.createTodo(item);

  return toReturn;


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
