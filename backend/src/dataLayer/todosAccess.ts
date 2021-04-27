
import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger';

import { TodoItem } from '../models/TodoItem'

const logger = createLogger('todosAccess');

export class TodoAccess {

  constructor(
    // DocumentClient allows us to work with DynamoDB
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly s3 = new AWS.S3(),
    private readonly s3Bucket = process.env.TODOS_IMAGES_S3_BUCKET
    ) {
  }

  async getTodos(userId): Promise<TodoItem[]> {

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    logger.info("Result", result)

    const items = result.Items
    return items as TodoItem[]
  }

  async deleteItem(userId: string, todoId: string) {
    let toReturn = {
      statusCode: 200,
      body: ""
    };

    let todoToBeDeleted = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todoId': todoId
    }
    }).promise()

    if(todoToBeDeleted.Items.length === 0) {
      toReturn.statusCode = 404;
      toReturn.body = 'The item to be deleted was not found';
    }

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
       }
      }).promise()


    await this.s3.deleteObject({
      Bucket: this.s3Bucket,
      Key: todoId
    }).promise()

    return toReturn;

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


