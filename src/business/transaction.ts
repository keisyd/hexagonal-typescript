import Joi from 'joi'
import {
  Transaction, OperationType, WalletStatus, TransactionStatus
} from '@models'
import { root, validateSchema } from '@business'
import { EClassError, nullCheck, throwCustomError } from '@utils'
import { isValidEntry } from './moment'

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
  serviceOrigin: Joi.string().required(),
  walletStatus: Joi.string().valid(...Object.values(WalletStatus)).required(),
  status: Joi.string().valid(...Object.values(TransactionStatus)).required()
})

/**
 * @description Validate the schema, and based on the equation
 * @function
 * @param {transaction} [Transaction] input data for create task
 * @returns {Transaction}
 */
export const validateTransaction = (transaction: Transaction, originMethodPath: string): Transaction => {
  switch (validateTransactionSchema(transaction, originMethodPath).status) {
    case TransactionStatus.SUCCESS: {
      if (transaction.operation === OperationType.REGISTER) { return validateRegisterTransaction(transaction, originMethodPath) }
      return validateSuccessTransaction(transaction, originMethodPath)
    }
    case TransactionStatus.FAIL: {
      return validateFailTransaction(transaction, originMethodPath)
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

  const vtransaction: Transaction = nullCheck<Transaction>(transaction, methodPath)

  /// transaction: Make time comparission to be sure that current operation time is greater than the last one
  if (isValidEntry(vtransaction.transactionTime)) {
    return validateSchema<Transaction>(vtransaction, transactionSchema.validate(vtransaction), methodPath)
  }

  return throwCustomError(
    new Error('Date has to be unique, formated and in greater than the past.'),
    methodPath,
    EClassError.USER_ERROR
  )
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

  const vtransaction: Transaction = validateTransactionSchema(nullCheck(transaction, methodPath), originMethodPath)

  const multiplier: number = getMultiplier(vtransaction.operation)

  if (vtransaction.amount === (vtransaction.previousAmount + (multiplier * vtransaction.amountTransacted))) {
    return vtransaction
  }

  return throwCustomError(
    new Error('Invalid sucessfull transaction. Must respect amount = previousAmount + (operationType)*amountTransacted '),
    methodPath,
    EClassError.USER_ERROR
  )
}

/**
 * @description Validate a unsucessfull transaction
 * where the amount === previousAmount
 * @function
 * @param {Transaction} [transaction] input data for create task
 * @returns {voTransactionid}
 */
export const validateFailTransaction = (transaction: Transaction, originMethodPath: string): Transaction => {
  const methodPath = `${namespace}.validateFailTransaction at ${originMethodPath}`

  const vtransaction: Transaction = validateTransactionSchema(nullCheck(transaction, methodPath), originMethodPath)

  if (vtransaction.amount === vtransaction.previousAmount) {
    return vtransaction
  }

  return throwCustomError(
    new Error('Invalid failed transaction. Must respect amount === previousAmount'),
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
        new Error('No matching Operation Type'),
        methodPath,
        EClassError.USER_ERROR
      )
    }
  }
}

export const validateAmount = (value: number, originMethodPath: string): number => {
  const methodPath = `${namespace}.validateAmount at ${originMethodPath}`

  if (nullCheck<number>(value, methodPath) >= 0) { return value }

  return throwCustomError(
    new Error("Can't operate negative amount."),
    methodPath,
    EClassError.USER_ERROR
  )
}

/**
 * @description Validate a unsucessfull transaction
 * where the amount === previousAmount
 * @function
 * @param {Transaction} [transaction] input data for create task
 * @returns {voTransactionid}
 */
export const validateRegisterTransaction = (transaction: Transaction, originMethodPath: string): Transaction => {
  const methodPath = `${namespace}.validateRegisterTransaction at ${originMethodPath}`

  const vtransaction: Transaction = validateTransactionSchema(nullCheck(transaction, methodPath), originMethodPath)

  if (vtransaction.amount === 0 && vtransaction.previousAmount === 0 && vtransaction.amountTransacted === 0) {
    return vtransaction
  }

  return throwCustomError(
    new Error('Invalid register transaction. Must respect amount === previousAmount === amountTransacted === 0'),
    methodPath,
    EClassError.USER_ERROR
  )
}
