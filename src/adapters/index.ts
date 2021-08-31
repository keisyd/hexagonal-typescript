import { DynamoRepositoryInstance } from '@ports/aws-dynamo'
import { Transaction } from '@models'
import transactionAdapterFactory, { TransactionAdapterInstance } from './transaction'
import { LoggerInstance } from '@ports/logger'
import creditAdapterFactory, { CreditAdapterInstance } from './credit'
import debitAdapterFactory, { DebitAdapterInstance } from './debit'
export const root: string = 'adapters'

export type AdapterFacadeTransaction = {
  readonly transaction: TransactionAdapterInstance
}

export type AdapterFacade = {
  readonly debit: DebitAdapterInstance
  readonly credit: CreditAdapterInstance
}

/**
 * @description dynamo repository for state machine
 *
 * @function
 * @param {Logger} logger - Instance of logger.
 * @param {DynamoRepositoryInstance} repository repository instatiated
 */
export const transactionAdapter = (logger: LoggerInstance, repository: DynamoRepositoryInstance<Transaction>): AdapterFacadeTransaction => ({
  transaction: transactionAdapterFactory(logger, repository)
})
/**
 * @description dynamo repository for state machine
 *
 * @function
 * @param {Logger} logger - Instance of logger.
 * @param {DynamoRepositoryInstance} repository repository instatiated
 */
export const adapter = (adapter: AdapterFacadeTransaction): AdapterFacade => ({
  credit: creditAdapterFactory(adapter),
  debit: debitAdapterFactory(adapter)
})
