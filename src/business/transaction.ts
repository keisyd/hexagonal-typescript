import Joi from "joi"
import {
  Transaction, OperationType, Service, WalletStatus, TransactionStatus,
} from "@models"
import { root, toISOString, validateSchema } from "@business"
import { EClassError, nullCheck, throwCustomError } from "@utils"


const namespace = `${root}.transactions`

const transactionSchema = Joi.object<Transaction>({
  walletId: Joi.string().required(),
  originId: Joi.string().required(),
  destinationId: Joi.string().required(),
  transactionTime: Joi.string().isoDate(),
  previousAmount: Joi.number().integer().min(0).required(),
  amountTransacted: Joi.number().integer().min(0).required(),
  amount: Joi.number().integer().min(0).required(),
  operation: Joi.string().valid(...Object.values(OperationType)).required(),
  serviceOrigin: Joi.string().valid(...Object.values(Service)).required(),
  walletStatus: Joi.string().valid(...Object.values(WalletStatus)).required(),
  status: Joi.string().valid(...Object.values(TransactionStatus)).required(),
})

/**
 * @description Validate the schema, and based on the equation
 * @function
 * @param {transaction} [Transaction] input data for create task
 * @returns {Transaction}
 */
export const validateTransaction = (transaction: Transaction, originMethodPath: string): Transaction => {
  const methodPath = `${namespace}.validateTransferAmount`

  transaction = validateTransactionSchema(transaction, originMethodPath)

  switch (transaction.status) {
    case TransactionStatus.SUCCESS: {
      return validateSuccessTransaction(transaction, originMethodPath)
    }
    case TransactionStatus.SUCCESS: {
      return validateFailTransaction(transaction, originMethodPath)
    }
    default: {
      return throwCustomError(
        new Error("No matching status"),
        methodPath + `at ${originMethodPath}`,
        EClassError.USER_ERROR
      )
    }
  }
}

/**
 * @description
 * Validate Transaction schema and add the proper current datetime
 * @function
 * @param {Transaction} [transaction]
 * @returns {Transaction}
 */
export const validateTransactionSchema = (
  transaction: Transaction, originMethodPath: string
): Transaction => {
  const methodPath = `${namespace}.validateTransactionSchema at ${originMethodPath}`

  const transactionTime = toISOString()

  transaction = nullCheck<Transaction>(transaction, methodPath)

  transaction = {
    ...transaction,
    // default values if is missing
    transactionTime: transactionTime,
  }

  return validateSchema<Transaction>(transaction, transactionSchema.validate(transaction), methodPath)
}

/**
 * @description Validate a sucessfull transaction
 * where the amount = previousAmount + (operationType)*amountTransacted
 * based on the operationType as a multiplier (see more on getMultiplier)
 * @function
 * @param {Transaction} [transaction] input data for create task
 * @returns {Transaction}
 */
export const validateSuccessTransaction = (transaction: Transaction, originMethodPath: string): Transaction => {
  const methodPath = `${namespace}.validateSuccessTransaction at ${originMethodPath}`

  transaction = validateTransactionSchema(nullCheck(transaction, methodPath), originMethodPath)

  const multiplier: number = getMultiplier(transaction.operation)

  if (transaction.amount == (transaction.previousAmount + (multiplier * transaction.amountTransacted))) {
    return transaction
  }

  return throwCustomError(
    new Error("Invalid sucessfull transaction. Must respect amount = previousAmount + (operationType)*amountTransacted "),
    methodPath,
    EClassError.USER_ERROR
  )
}

/**
 * @description Validate a unsucessfull transaction
 * where the amount == previousAmount
 * @function
 * @param {Transaction} [transaction] input data for create task
 * @returns {voTransactionid}
 */
export const validateFailTransaction = (transaction: Transaction, originMethodPath: string): Transaction => {
  const methodPath = `${namespace}.validateFailTransaction at ${originMethodPath}`

  transaction = validateTransactionSchema(nullCheck(transaction, methodPath), originMethodPath)

  if (transaction.amount == transaction.previousAmount) {
    return transaction
  }

  return throwCustomError(
    new Error("Invalid failed transaction. Must respect amount == previousAmount"),
    methodPath,
    EClassError.USER_ERROR
  )
}

/**
 * @description Transalate a Operation Type into a multiplier
 * @function
 * @param {OperationType} [operation] input data for create task
 * @returns returns 1 if DEBIT and -1 if CREDIT
 */
export const getMultiplier = (operation: OperationType): number => {
  const methodPath = `${namespace}.getMultiplier`

  switch (operation) {
    case OperationType.DEBIT: {
      return -1
    }
    case OperationType.CREDIT: {
      return 1
    }
    default: {
      return throwCustomError(
        new Error("No matching Operation Type"),
        methodPath,
        EClassError.USER_ERROR
      )
    }
  }
}


