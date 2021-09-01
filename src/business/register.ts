import { generateWalletId, root, validateAmount, validateRegisterTransaction } from '@business'
import { nullCheck } from '@utils'
import Joi from 'joi'
import {
  RegisterRequest, OperationType, Transaction, TransactionStatus, WalletStatus
} from '@models'
import { validateSchema } from './schema'

const namespace: string = `${root}.register`

export const registerRequestSchema = Joi.object<RegisterRequest>({
  personalId: Joi.string().required(),
  serviceOrigin: Joi.string().valid('REGISTER').required(),
  operation: Joi.string().valid(OperationType.REGISTER).required(),
  token: Joi.string().required()
})

/**
 * @description Validate register Request
 * @function
 * @param {RegisterRequest} [data] the register request
 * @returns {RegisterRequest}
 */
export const validateRegisterRequest =
  (registerRequest: RegisterRequest): RegisterRequest => {
    const methodPath: string = `${namespace}.validateRegisterRequest`

    const data: RegisterRequest = nullCheck<RegisterRequest>(registerRequest, methodPath)

    return validateSchema<RegisterRequest>(data, registerRequestSchema.validate(data), methodPath)
  }

/**
 * @description Takes the register request and the last Transaction on
 * the wallet then returns a Credited Transaction
 * @function
 * @param {RegisterRequest} [data] the register request
 * @param {Transaction} [lastTransaction] the last transaction on the origin wallet
 * @returns {Transaction}
 */
export const createRegisterTransaction = (
  registerRequest: RegisterRequest,
  time: string
): Transaction => {
  const methodPath = `${namespace}.createRegisterTransaction`

  const data: RegisterRequest = validateRegisterRequest(nullCheck<RegisterRequest>(registerRequest, methodPath))

  /// transaction: Should I validate the lastTransaction?

  const transaction: Transaction = {
    // default values if is missing
    walletId: generateWalletId(data.personalId),
    destinationId: ' ',
    originId: ' ',
    operation: OperationType.REGISTER,
    serviceOrigin: data.serviceOrigin,
    status: TransactionStatus.SUCCESS,
    amount: 0,
    previousAmount: 0,
    amountTransacted: 0,
    walletStatus: WalletStatus.VALIDATED,
    /// transaction: make transactionTime be future in comparision to lasTransaction.transactionTime
    transactionTime: time
  }

  return validateRegisterTransaction(transaction, methodPath)
}

/**
 * @description Takes the register request and the last Transaction on
 * the wallet then returns a Credited Transaction
 * @function
 * @param {RegisterRequest} [data] the register request
 * @param {Transaction} [lastTransaction] the last transaction on the origin wallet
 * @returns {Transaction}
 */
export const register = (
  currentAmount: number,
  transactionAmount: number
): number => {
  const methodPath = `${namespace}.register`

  return (validateAmount(currentAmount, methodPath) + validateAmount(transactionAmount, methodPath))
}
