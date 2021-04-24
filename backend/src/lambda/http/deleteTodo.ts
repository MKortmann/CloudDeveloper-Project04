// import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/logger';

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({});
const logger = createLogger('deleteTodo');

const todosTable = process.env.TODOS_TABLE;
// used to delete the image
const s3Bucket = process.env.TODOS_IMAGES_S3_BUCKET;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const result = await docClient.delete({
    TableName: todosTable,
    Key: {
      id: todoId
    },
  }).promise()

  // deleting the image object
  logger.info('Read to delete an image object: ', {
    event
  })

  await s3.deleteObject({
    Bucket: s3Bucket,
    Key: todoId
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: "item was deleted: " + JSON.stringify(result)
  }


}
