import { DynamoRepositoryInstance } from '@ports/aws-dynamo'
import { Todo, Transaction, Wallet } from '@models'
import { LoggerInstance } from '@ports/logger'
import todoAdapterFactory, { TodoAdapterInstance } from './todo'
import transactionAdapterFactory, { TransactionAdapterInstance } from './transaction'
import walletAdapterFactory, { WalletAdapterInstance } from './transaction'

export const root:string = "adapters"

export type AdapterFacade = {
  readonly todo: TodoAdapterInstance
  readonly transaction: TransactionAdapterInstance
  readonly wallets: WalletAdapterInstance
}

/**
 * @description dynamo repository for state machine
 *
 * @function
 * @param {Logger} logger - Instance of logger.
 * @param {DynamoRepositoryInstance} repository repository instatiated
 */
export const adapter = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Todo>,
  transactionRepository: DynamoRepositoryInstance<Transaction>,
  walletRepository: DynamoRepositoryInstance<Wallet>

  ): AdapterFacade => ({
  todo: todoAdapterFactory(logger, repository),
  transaction: transactionAdapterFactory(logger, transactionRepository),
  wallets: walletAdapterFactory(logger, walletRepository)
})
