import { OperationRequest, Transaction } from '@models'
import { EClassError, nullCheck, throwCustomError } from '@utils'
import {
  createDebitTransaction, toISOString
} from '@business'
import { AdapterFacadeTransaction, root } from '@adapters'
import moment from 'moment'

const namespace: string = `${root}.transaction`

export type DebitAdapterInstance = {
  readonly debit: (req: OperationRequest) => Promise<Transaction | null>
}

/**
 * @description debit adapter factory
 * @memberof adapters
 * @function
 * @param {OperationRequest} req Debit operation request
 */
const debitAdapterFactory = (
  adapter: AdapterFacadeTransaction
): DebitAdapterInstance => ({
  debit: debit(adapter)
})

export default debitAdapterFactory

export const debit = (adapter: AdapterFacadeTransaction) => async (req: OperationRequest): Promise<Transaction> => {
  const methodPath = `${namespace}.debit`

  try {
    const lastTransaction = await adapter.transaction.getTransaction(req.originId)

    const transactionInserted: Transaction = await adapter.transaction.insertTransaction(
      createDebitTransaction(
        req,
        nullCheck(lastTransaction, methodPath) as Transaction,
        toISOString(moment())
      )
    )

    return transactionInserted
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
