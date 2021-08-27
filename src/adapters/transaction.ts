import { DynamoRepositoryInstance } from '@ports/aws-dynamo'
import { Transaction } from '@models'
import { EClassError, throwCustomError } from '@utils'
import {
  validateTransaction
} from '@business'
import { LoggerInstance } from '@ports/logger'

export type TransactionAdapterInstance = {
  readonly getTransaction: (walletId: string) => Promise<Transaction | null>
  readonly createTransaction: (params: Transaction) => Promise<Transaction>
}

/**
 * @description Transaction adapter factory
 * @memberof adapters
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {DynamoRepositoryInstance<Transaction>} repository Dynamo database methods
 */
const transactionAdapterFactory = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Transaction>
): TransactionAdapterInstance => ({
  getTransaction: getTransaction(repository),
  createTransaction: createTransaction(logger, repository)
})

export default transactionAdapterFactory
/**
 * @description Handler function to get transaction data by id .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Transaction>} repository - Dynamo database methods.
 */
const getTransaction = (repository: DynamoRepositoryInstance<Transaction>) => async (
  id: string
) => {
  const methodPath = 'adapters.transaction.getTransaction'
  try {
    const result = await repository.getDocument({ id })
    return result.value
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * @description Create transaction in the DynamoDB.
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {DynamoRepositoryInstance<Transaction>} repository Dynamo database methods
 */
const createTransaction = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Transaction>
) => async (params: Transaction) => {
  const methodPath = 'adapters.transaction.createTransaction'
  try {
    const result = await repository.putDocument(
      validateTransaction(params, methodPath)
    )

    logger.info(methodPath, {
      action: 'TASK_CREATED',
      method: methodPath,
      data: { ...result }
    })

    return { ...result.value }
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
