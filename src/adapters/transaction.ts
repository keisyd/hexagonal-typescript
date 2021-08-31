import { DynamoRepositoryInstance } from '@ports/aws-dynamo'
import { Transaction } from '@models'
import { EClassError, throwCustomError } from '@utils'
import {
  validateTransaction
} from '@business'
import { LoggerInstance } from '@ports/logger'
import { root } from '@adapters'

export type TransactionAdapterInstance = {
  readonly getTransaction: (walletId: string) => Promise<Transaction | null>
  readonly insertTransaction: (params: Transaction) => Promise<Transaction>
}

const namespace: string = `${root}.transaction`

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
  insertTransaction: insertTransaction(logger, repository)
})

export default transactionAdapterFactory
/**
 * @description Handler function to get last transaction data by walletId .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Transaction>} repository - Dynamo database methods.
 */
const getTransaction = (repository: DynamoRepositoryInstance<Transaction>) => async (
  walletId: string
) => {
  const methodPath = `${namespace}.getTransaction`
  try {
    const result = await repository.getLastTransaction({ id: walletId })
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
const insertTransaction = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Transaction>
) => async (params: Transaction) => {
  const methodPath = `${namespace}.insertTransaction`

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
