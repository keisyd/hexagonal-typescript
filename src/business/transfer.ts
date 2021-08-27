import { generateToken, root, validateSchema } from '@business'
import {
  OperationRequest, OperationType, Service, Transaction
} from '@models'
import { ServiceRequester } from '@models/service-requester'
import { nullCheck } from '@utils'
import Joi from 'joi'
import { validateCreditRequest } from './credit'

const namespace: string = `${root}.trasnfer`

export const transferRequestSchema = Joi.object<OperationRequest>({
  originId: Joi.string().required(),
  destinationId: Joi.string().required(),
  amount: Joi.number().integer().min(0).required(),
  /// The invalid service origins means that all other service are also transfer, with some specifics
  serviceOrigin: Joi.string().invalid(Service.WITHDRAW, Service.DEPOSIT).required(),
  operation: Joi.string().valid(OperationType.DEBIT).required(),
  requester: Joi.string().invalid(ServiceRequester.WITHDRAW).required(),
  token: Joi.string().required()
})

/**
 * @description Creates a credit request for the
 * secont stage of transfer that is the
 * @function
 * @param {OperationRequest} [data] the debit request
 * @param {Transaction} [lastTransaction] the last transaction on the origin wallet
 * @returns {Transaction}
 */
export const createCreditRequest = (
  dataR: OperationRequest,
  debitTransaction: Transaction
): OperationRequest => {
  const methodPath = `${namespace}.createDebitTransaction`

  const data = validateSchema<OperationRequest>(nullCheck<OperationRequest>(dataR, methodPath), transferRequestSchema.validate(nullCheck<OperationRequest>(dataR, methodPath)), methodPath)

  const creditRequest: OperationRequest = {
    originId: data.originId,
    destinationId: data.destinationId,
    amount: data.amount,
    serviceOrigin: data.serviceOrigin,
    operation: OperationType.CREDIT,
    requester: ServiceRequester.CORE,
    token: generateToken(debitTransaction, methodPath)
  }

  return validateCreditRequest(creditRequest, debitTransaction)
}
