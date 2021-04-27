
import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger';

import { TodoItem } from '../models/TodoItem'

const logger = createLogger('todosAccess');

export class TodoAccess {

  constructor(
    // DocumentClient allows us to work with DynamoDB
    // groupsTable is the table where we store the names about our groups
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getTodos(userId): Promise<TodoItem[]> {
    console.log('Getting all todos');
    console.log('tableName', this.todosTable);
    console.log('userId', userId);

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    console.log('Result', result);

    logger.info("Result", result)

    const items = result.Items
    return items as TodoItem[]
  }

  // async createTodo(todo: todoItem): Promise<TodoItem> {
  //   await this.docClient.put({
  //     TableName: this.todosTable,
  //     Item: todo
  //   }).promise()

  //   return todo
  // }
}

function createDynamoDBClient() {
  // if you are offline, serverless offline will set this variable IS_OFFLINE to true
  // if (process.env.IS_OFFLINE) {
  //   console.log('Creating a local DynamoDB instance')
  //   return new AWS.DynamoDB.DocumentClient({
  //     region: 'localhost',
  //     endpoint: 'http://localhost:8000'
  //   })
  // }

  return new AWS.DynamoDB.DocumentClient()
}


