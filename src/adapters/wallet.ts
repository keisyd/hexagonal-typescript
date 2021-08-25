import { DynamoRepositoryInstance } from "@ports/aws-dynamo"
import { Wallet } from "@models"
import { EClassError, throwCustomError } from "@utils"
import { LoggerInstance } from "@ports/logger"
import { root } from "@adapters"
import { validateWallet } from "@business"

const namespace: string = `${root}.wallet`

export type WalletAdapterInstance = {
  readonly getWallet: (walletId: string) => Promise<Wallet | null>
  readonly createWallet: (id: Wallet) => Promise<Wallet | null>
}

/**
 * @description Todo adapter factory
 * @memberof adapters
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {DynamoRepositoryInstance<Wallet>} repository Dynamo database methods
 */
const walletAdapterFactory = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Wallet>,
): WalletAdapterInstance => ({
  getWallet: getWallet(repository),
  createWallet: createWallet(repository),
})

export default walletAdapterFactory

/**
 * @description Handler function to get wallet data by wallet id .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Wallet>} repository - Dynamo database methods.
 */
const getWallet = (repository: DynamoRepositoryInstance<Wallet>) => async (
  walletId: string
) => {
  const methodPath = `${namespace}.getWallet`
  try {
    const result = await repository.getDocument({ walletId })
    return result.value
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * @description Handler function to get wallet data by wallet id .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Wallet>} repository - Dynamo database methods.
 */
const createWallet = (repository: DynamoRepositoryInstance<Wallet>) => async (
  wallet: Wallet
) => {
  const methodPath = `${namespace}.createWallet`
  try {
    wallet = validateWallet(wallet)

    const result = await repository.putDocument({ wallet })

    return result.value
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}





