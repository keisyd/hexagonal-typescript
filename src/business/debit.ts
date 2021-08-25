import { root, toISOString, validateSuccessTransaction, validateTransaction } from "@business"
import { EClassError, nullCheck, throwCustomError } from "@utils"
import Joi from "joi"
import {
  OperationRequest, OperationType, Service, Transaction, TransactionStatus,
} from "@models"
import { v4 as uuidv4 } from "uuid"
import { validateSchema } from "./schema"

const namespace: string = `${root}.debit`

export const debitRequestSchema = Joi.object<OperationRequest>({
  originId: Joi.string().required(),
  destinationId: Joi.string().required(),
  amount: Joi.number().integer().min(0).required(),
  serviceOrigin: Joi.string().invalid(...Object.values(Service.DEPOSIT)).valid(...Object.values(Service)).required(),
  operation: Joi.string().valid(...Object.values(OperationType.DEBIT)).required(),
})

/**
 * @description Validate debit Request
 * @function
 * @param {OperationRequest} [data] the debit request
 * @returns {OperationRequest}
 */
export const validateDebitRequest = (
  data: OperationRequest,
  lastTransaction: Transaction
): OperationRequest => {
  const methodPath = `${namespace}.validateDebitRequest`

  data = nullCheck<OperationRequest>(data, methodPath)

  if (data.originId == lastTransaction.walletId) {
    if (data.amount < lastTransaction.amount)
      return validateSchema<OperationRequest>(data, debitRequestSchema.validate(data), methodPath)

    return throwCustomError(
      new Error("Insuficient Funds"),
      methodPath,
      EClassError.USER_ERROR
    )
  } else {
    return throwCustomError(
      new Error("Inconsistent Debit Request. originId must match walletId of the last transaction"),
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
export const createDebitTransaction = (
  data: OperationRequest,
  lastTransaction: Transaction
): Transaction => {
  const methodPath = `${namespace}.createDebitTransaction`

  data = validateDebitRequest(data, lastTransaction)

  ///Todo: Should I validate the lastTransaction?

  const transaction: Transaction = {
    // default values if is missing
    walletId: lastTransaction.walletId,
    destinationId: data.destinationId, //!TODO: Insert a defatult from env
    originId: data.originId,
    operation: OperationType.DEBIT,
    serviceOrigin: data.serviceOrigin,
    status: TransactionStatus.SUCCESS,
    amount: debit(lastTransaction.amount, data.amount),
    previousAmount: lastTransaction.amount,
    amountTransacted: data.amount,
    walletStatus: lastTransaction.walletStatus,
    transactionTime: toISOString()
  }

  return validateSuccessTransaction(transaction)
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

  if (currentAmount > transactionAmount)
    return (currentAmount - transactionAmount)

  return throwCustomError(
    new Error("Can't debit. currentAmount must be greater than transactionAmount"),
    methodPath,
    EClassError.USER_ERROR
  )
}





