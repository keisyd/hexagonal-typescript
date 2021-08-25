import { DynamoRepositoryInstance } from "@ports/aws-dynamo"
import { Debit, Transaction, Wallet } from "@models"
import { EClassError, throwCustomError } from "@utils"
import { LoggerInstance } from "@ports/logger"
import { transactionForDebit, validateDebit, validateDebitRequest, validateTransaction } from "@business"
import { root, AdapterFacade } from "@adapters"

const namespace: string = `${root}.debit`

export type DebitAdapterInstance = {
  readonly debit: (id: Wallet) => Promise<Debit | null>
}

/**
 * @description Todo adapter factory
 * @memberof adapters
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {DynamoRepositoryInstance<Wallet>} repository Dynamo database methods
 */
const todoAdapterFactory = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Wallet>,
): DebitAdapterInstance => ({
  debit: debit(repository),
})

export default todoAdapterFactory

/**
 * @description Handler function to get todo data by id .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Todo>} repository - Dynamo database methods.
 */
const debit = (
  logger: LoggerInstance,
  adapter: AdapterFacade
) => (repository: DynamoRepositoryInstance<Wallet>) => async (
  debitRequest: Debit
) => {
  const methodPath = `${namespace}.transfer`

  try {
    validateDebitRequest(debitRequest)

    adapter.transaction.createTransaction(transaction)

    const result = await repository.getDocument({ id })

    return result.value
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
