import { EClassError, throwCustomError } from '@utils'
import { AWSError, DynamoDB } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'
import R from 'ramda'

export type DynamoResult<T, U> = {
  readonly operationResult: PromiseResult<U, AWSError>
  readonly value: T
  readonly requestId: string
}

/**
 * @description Get a document on table TableName in the DynamoDB.
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 */
export const getDocument = <T>(dynamo: DynamoDB.DocumentClient, tableName: string) => async (key: DynamoDB.DocumentClient.Key): Promise<DynamoResult<T | null, DynamoDB.DocumentClient.GetItemOutput>> => {
  try {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: tableName,
      KeyConditionExpression: 'walletId = :walletId_value',
      ExpressionAttributeValues: {
        ':walletId_value': key.id
      },
      ScanIndexForward: true,
      Limit: 10 // DataPerReq
    }

    const operationResult = await dynamo.query(params).promise()

    const items: ReadonlyArray<T> = R.not(R.isNil(operationResult.Items)) ? operationResult.Items as ReadonlyArray<T> : []

    const lastIndex: number = items.length - 1

    const value = lastIndex >= 0 ? items[lastIndex] as T : null

    const requestId = operationResult.$response.requestId

    return {
      operationResult,
      value,
      requestId
    }
  } catch (error) {
    return throwCustomError(error, 'ports.aws-dynamo.getDocument', EClassError.INTERNAL)
  }
}

/**
 * Update document in the DynamoDB.
 *
 * @function
 * @param {DynamoDB.DocumentClient} dynamo instance of Dynamo SDK for aws (DocumentClient)
 * @param {string} tableName name of table in DynamoDB
 */
export const putDocument = <T>(dynamo: DynamoDB.DocumentClient, tableName: string) => async (item: DynamoDB.DocumentClient.PutItemInputAttributeMap): Promise<DynamoResult<T, DynamoDB.DocumentClient.PutItemOutput>> => {
  try {
    const params = {
      TableName: tableName,
      Item: item
    }

    const operationResult = await dynamo.put(params).promise()
    const value = { ...item } as T
    const requestId = operationResult.$response.requestId

    return {
      operationResult,
      value,
      requestId
    }
  } catch (error) {
    return throwCustomError(error, 'ports.aws-dynamo.putDocument', EClassError.INTERNAL)
  }
}

/**
 * @description Add ":" in all variables in prefix remapping the object
 * @param {Object} obj object param in ExpressionAttributeValues
 */
export const remapPrefixVariables = <T extends { readonly [key: string]: any }>(obj: T): Exclude<T, keyof T> => {
  return Object
    .keys(obj).reduce((prev, curr) => {
      return { ...prev, [`:${curr}`]: obj[curr] }
    }, {} as Exclude<T, keyof T>)
}
