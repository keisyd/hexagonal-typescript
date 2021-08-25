import { root, toISOString, validateSuccessTransaction, validateTransaction } from "@business"
import { EClassError, nullCheck, throwCustomError } from "@utils"
import Joi from "joi"
import {
  OperationRequest, OperationType, Service, Transaction, TransactionStatus,
} from "@models"
import { v4 as uuidv4 } from "uuid"
import { validateSchema } from "./schema"

const namespace: string = `${root}.credit`

export const creditRequestSchema = Joi.object<OperationRequest>({
  originId: Joi.string().required(),
  destinationId: Joi.string().required(),
  amount: Joi.number().integer().min(0).required(),
  serviceOrigin: Joi.string().invalid(...Object.values(Service.DEPOSIT)).valid(...Object.values(Service)).required(),
  operation: Joi.string().valid(...Object.values(OperationType.DEBIT)).required(),
})

/**
 * @description Validate credit Request
 * @function
 * @param {OperationRequest} [data] the credit request
 * @returns {OperationRequest}
 */
export const validateCreditRequest = (
  data: OperationRequest,
  lastTransaction: Transaction
): OperationRequest => {
  const methodPath = `${namespace}.validateCreditRequest`

  data = nullCheck<OperationRequest>(data, methodPath)

  if (data.destinationId == lastTransaction.walletId)
    return validateSchema<OperationRequest>(data, creditRequestSchema.validate(data), methodPath)


  return throwCustomError(
    new Error("Inconsistent Credit Request. The destinationId must match walletId of the last transaction"),
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
  data: OperationRequest,
  lastTransaction: Transaction
): Transaction => {
  const methodPath = `${namespace}.createCreditTransaction`

  data = validateCreditRequest(data, lastTransaction)

  ///Todo: Should I validate the lastTransaction?

  const transaction: Transaction = {
    // default values if is missing
    walletId: lastTransaction.walletId,
    destinationId: data.destinationId, //!TODO: Insert a defatult from env
    originId: data.originId,
    operation: OperationType.DEBIT,
    serviceOrigin: data.serviceOrigin,
    status: TransactionStatus.SUCCESS,
    amount: credit(lastTransaction.amount, data.amount),
    previousAmount: lastTransaction.amount,
    amountTransacted: data.amount,
    walletStatus: lastTransaction.walletStatus,
    transactionTime: toISOString()
  }

  return validateSuccessTransaction(transaction)
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

  return (currentAmount + transactionAmount)
}





