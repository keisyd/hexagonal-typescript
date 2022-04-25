import { root, validateAmount, validateSuccessTransaction } from '@business'
import { EClassError, nullCheck, throwCustomError, validateSchema } from '@utils'
import Joi from 'joi'
import {
  OperationRequest, OperationType, Transaction, TransactionStatus
} from '@models'

const namespace: string = `${root}.debit`

export const debitRequestSchema = Joi.object<OperationRequest>({
  originId: Joi.string().required(),
  destinationId: Joi.string().required(),
  amount: Joi.number().integer().min(0).required(),
  serviceOrigin: Joi.string().invalid('DEPOSIT').required(),
  operation: Joi.string().valid(OperationType.DEBIT).required(),
  token: Joi.string().required()
})

/**
 * @description Takes the debit request and the last Transaction on
 * the wallet then returns a Debited Transaction
 * @function
 * @param {OperationRequest} [data] the debit request
 * @param {Transaction} [lastTransaction] the last transaction on the origin wallet
 * @returns {Transaction}
 */
export const createDebitTransaction = (
  operationRequest: OperationRequest,
  lastTransaction: Transaction,
  transactionTime: string
): Transaction => {
  const methodPath = `${namespace}.createDebitTransaction`

  const data: OperationRequest = validateDebitRequest(operationRequest, lastTransaction)

  /// transaction: Should I validate the lastTransaction?

  const transaction: Transaction = {
    // default values if is missing
    walletId: lastTransaction.walletId,
    destinationId: data.destinationId,
    originId: data.originId,
    operation: OperationType.DEBIT,
    serviceOrigin: data.serviceOrigin,
    status: TransactionStatus.SUCCESS,
    amount: debit(lastTransaction.amount, data.amount),
    previousAmount: lastTransaction.amount,
    amountTransacted: data.amount,
    walletStatus: lastTransaction.walletStatus,
    /// transaction: make transactionTime be future in comparision to lasTransaction.transactionTime
    transactionTime: transactionTime
  }

  return validateSuccessTransaction(transaction, methodPath)
}

/**
 * @description Validate debit Request
 * @function
 * @param {OperationRequest} [data] the debit request
 * @returns {OperationRequest}
 */
export const validateDebitRequest = (
  operationRequest: OperationRequest,
  lastTransaction: Transaction
): OperationRequest => {
  const methodPath = `${namespace}.validateDebitRequest`

  const data: OperationRequest = nullCheck<OperationRequest>(operationRequest, methodPath)

  if (data.originId === lastTransaction.walletId) {
    if (data.amount <= lastTransaction.amount) { return validateSchema<OperationRequest>(data, debitRequestSchema.validate(data), methodPath) }

    return throwCustomError(
      new Error('Insuficient Funds'),
      methodPath,
      EClassError.USER_ERROR
    )
  } else {
    return throwCustomError(
      new Error('Inconsistent Debit Request. originId must match walletId of the last transaction'),
      methodPath,
      EClassError.USER_ERROR
    )
  }
}

/**
 * @description Takes the debit request and the last Transaction on
 * the wallet then returns a Debited Transaction
 * @function
 * @param {OperationRequest} [data] the debit request
 * @param {Transaction} [lastTransaction] the last transaction on the origin wallet
 * @returns {Transaction}
 */
export const debit = (
  currentAmount: number,
  transactionAmount: number
): number => {
  const methodPath = `${namespace}.debit`

  if (validateAmount(currentAmount, methodPath) >= validateAmount(transactionAmount, methodPath)) {
    return (currentAmount - transactionAmount)
  }

  return throwCustomError(
    new Error("Can't debit. The currentAmount must be greater than transactionAmount " + currentAmount + ' ' + transactionAmount),
    methodPath,
    EClassError.USER_ERROR
  )
}
