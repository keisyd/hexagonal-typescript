import { OperationRequest, Transaction } from '@models'
import { EClassError, nullCheck, throwCustomError } from '@utils'
import {
  createCreditTransaction, toISOString
} from '@business'
import { AdapterFacadeTransaction, root } from '@adapters'
import moment from 'moment-timezone'

const namespace: string = `${root}.transaction`

export type CreditAdapterInstance = {
  readonly credit: (req: OperationRequest) => Promise<Transaction | null>
}

/**
 * @description Credit adapter factory
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Transaction>} repository Dynamo database methods
 */
const creditAdapterFactory = (
  adapter: AdapterFacadeTransaction
): CreditAdapterInstance => ({
  credit: credit(adapter)
})

export default creditAdapterFactory

export const credit = (adapter: AdapterFacadeTransaction) => async (req: OperationRequest): Promise<Transaction> => {
  const methodPath = `${namespace}.credit`

  try {
    const lastTransaction = await adapter.transaction.getTransaction(req.destinationId)

    return await adapter.transaction.insertTransaction(
      createCreditTransaction(
        req,
        nullCheck(lastTransaction, methodPath) as Transaction,
        toISOString(moment())
      )
    )
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
