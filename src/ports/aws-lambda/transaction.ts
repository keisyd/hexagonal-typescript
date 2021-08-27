import { adapter } from '@adapters'
import { appConfig, AWSDynamoConfig } from '@config'
import { Transaction } from '@models'
import { databaseRepository } from '@ports/aws-dynamo'
import { handleLogger } from '@ports/logger'
import { EClassError, throwCustomError } from '@utils'
import { AppSyncResolverEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

type ResolversMap<T> = {
  readonly [key: string]: () => Promise<T | null>
}

/**
 * Transaction handler.
 * more about: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * @memberof ports/aws/lambda
 * @param {AppSyncResolverEvent<any>} event event object information from lambda (https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-s3.html)
 * @param {*} circuit breaker function
 */
export const handler = async (event: AppSyncResolverEvent<any> & { readonly field: string }, context: Context): Promise<any> => {
  const appName = 'Transaction'
  const isProduction = process.env.ENV_NAME === 'production'
  const envName = isProduction ? 'production' : 'staging'

  // Logger configuration.
  const logger = handleLogger(appName, envName)

  // AWS Dynamo configuration.
  AWS.config.update(AWSDynamoConfig)
  const dynamo = new AWS.DynamoDB.DocumentClient()

  // inject repositories
  const databaseRepoInstance = databaseRepository<Transaction>(dynamo, appConfig.transaction.tableName)
  const adapterInstance = adapter(logger, databaseRepoInstance)

  const getTransaction = async (): Promise<Transaction | null> => {
    try {
      const { id } = event.arguments
      const result = await adapterInstance.transaction.getTransaction(id)
      logger.info('handler.get', `Get the task: ${id}`)
      return result
    } catch (error) {
      logger.error('handler.generate', { ...error })
      return throwCustomError(error, 'ports.aws-lambda.Transaction.getTransaction', EClassError.INTERNAL)
    }
  }

  const createTransaction = async (): Promise<Transaction> => {
    try {
      const result = await adapterInstance.transaction.createTransaction(event.arguments.data)
      logger.info('handler.generate', `Generated the task: ${result.walletId}`)
      return result
    } catch (error) {
      logger.error('handler.generate', { ...error })
      return throwCustomError(error, 'ports.aws-lambda.Transaction.createTransaction', EClassError.INTERNAL)
    }
  }
  const resolvers: ResolversMap<Transaction> = {
    getTransaction,
    createTransaction
  }

  if (Object.keys(resolvers).indexOf(event.field) === -1) {
    return throwCustomError(new Error(`No resolver for ${event.field}`), 'ports.aws-lambda.Transaction', EClassError.INTERNAL)
  }

  logger.info('handler', `Function "${context.functionName}" running - ID: ${context.awsRequestId}`)

  const output = await resolvers[event.field]()

  return output
}
