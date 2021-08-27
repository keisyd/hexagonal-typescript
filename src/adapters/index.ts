import { DynamoRepositoryInstance } from '@ports/aws-dynamo'
import { Transaction } from '@models'
import transactionAdapterFactory, { TransactionAdapterInstance } from './transaction'
import { LoggerInstance } from '@ports/logger'

export type AdapterFacade = {
  readonly transaction: TransactionAdapterInstance
}

/**
 * @description dynamo repository for state machine
 *
 * @function
 * @param {Logger} logger - Instance of logger.
 * @param {DynamoRepositoryInstance} repository repository instatiated
 */
export const adapter = (logger: LoggerInstance, repository: DynamoRepositoryInstance<Transaction>): AdapterFacade => ({
  transaction: transactionAdapterFactory(logger, repository)
})
