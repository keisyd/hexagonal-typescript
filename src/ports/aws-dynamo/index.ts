import { DynamoDB } from 'aws-sdk'
import { getDocument, putDocument, DynamoResult } from './aws.dynamo'

export { DynamoResult } from './aws.dynamo'

export type DynamoRepositoryInstance<T> = {
  readonly getDocument: (key: DynamoDB.DocumentClient.Key) => Promise<DynamoResult<T | null, DynamoDB.DocumentClient.GetItemOutput>>
  readonly putDocument: (item: DynamoDB.DocumentClient.PutItemInputAttributeMap) => Promise<DynamoResult<T, DynamoDB.DocumentClient.UpdateItemOutput>>
}

export const databaseRepository = <T>(dynamo: DynamoDB.DocumentClient, tableName: string): DynamoRepositoryInstance<T> => ({
  getDocument: getDocument<T>(dynamo, tableName),
  putDocument: putDocument<T>(dynamo, tableName)
})
