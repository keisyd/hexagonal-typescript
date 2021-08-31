import { root, validateAmount, validateSuccessTransaction } from '@business'
import { EClassError, nullCheck, throwCustomError } from '@utils'
import Joi from 'joi'
import {
  OperationRequest, OperationType, Transaction, TransactionStatus
} from '@models'
import { validateSchema } from './schema'

const namespace: string = `${root}.credit`

export const creditRequestSchema = Joi.object<OperationRequest>({
  originId: Joi.string().required(),
  destinationId: Joi.string().required(),
  amount: Joi.number().integer().min(0).required(),
  serviceOrigin: Joi.string().invalid('WITHDRAW').required(),
  operation: Joi.string().valid(OperationType.CREDIT).required(),
  token: Joi.string().required()
})

/**
 * @description Validate credit Request
 * @function
 * @param {OperationRequest} [data] the credit request
 * @returns {OperationRequest}
 */
export const validateCreditRequest = (
  operationRequest: OperationRequest,
  lastTransaction: Transaction
): OperationRequest => {
  const methodPath = `${namespace}.validateCreditRequest`

  const data: OperationRequest = nullCheck<OperationRequest>(operationRequest, methodPath)

  if (data.destinationId === lastTransaction.walletId) {
    return validateSchema<OperationRequest>(data, creditRequestSchema.validate(data), methodPath)
  }

  return throwCustomError(
    new Error('Inconsistent Credit Request. The destinationId must match walletId of the last transaction'),
    methodPath,
    EClassError.USER_ERROR
  )
}

/**
 * @description Takes the credit request and the last Transaction on
 * the wallet then returns a Credited Transaction
 * @function
 * @param {OperationRequest} [data] the credit request
 * @param {Transaction} [lastTransaction] the last transaction on the origin wallet
 * @returns {Transaction}
 */
export const createCreditTransaction = (
  operationRequest: OperationRequest,
  lastTransaction: Transaction,
  time: string
): Transaction => {
  const methodPath = `${namespace}.createCreditTransaction`

  const data: OperationRequest = validateCreditRequest(nullCheck<OperationRequest>(operationRequest, methodPath), lastTransaction)

  /// transaction: Should I validate the lastTransaction?

  const transaction: Transaction = {
    // default values if is missing
    walletId: lastTransaction.walletId,
    destinationId: data.destinationId,
    originId: data.originId,
    operation: OperationType.CREDIT,
    serviceOrigin: data.serviceOrigin,
    status: TransactionStatus.SUCCESS,
    amount: credit(lastTransaction.amount, data.amount),
    previousAmount: lastTransaction.amount,
    amountTransacted: data.amount,
    walletStatus: lastTransaction.walletStatus,
    /// transaction: make transactionTime be future in comparision to lasTransaction.transactionTime
    transactionTime: time
  }

  return validateSuccessTransaction(transaction, methodPath)
}

/**
 * @description Takes the credit request and the last Transaction on
 * the wallet then returns a Credited Transaction
 * @function
 * @param {OperationRequest} [data] the credit request
 * @param {Transaction} [lastTransaction] the last transaction on the origin wallet
 * @returns {Transaction}
 */
export const credit = (
  currentAmount: number,
  transactionAmount: number
): number => {
  const methodPath = `${namespace}.credit`

  return (validateAmount(currentAmount, methodPath) + validateAmount(transactionAmount, methodPath))
}
