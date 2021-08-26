import { generateToken, root } from "@business"
import {
  OperationRequest, OperationType, Transaction
} from "@models"
import { ServiceRequester } from "@models/service-requester"
import { validateCreditRequest } from "./credit"

const namespace: string = `${root}.trasnfer`

/**
 * @description Creates a credit request for the
 * secont stage of transfer that is the
 * @function
 * @param {OperationRequest} [data] the debit request
 * @param {Transaction} [lastTransaction] the last transaction on the origin wallet
 * @returns {Transaction}
 */
export const createCreditRequest = (
  data: OperationRequest,
  debitTransaction: Transaction
): OperationRequest => {
  const methodPath = `${namespace}.createDebitTransaction`

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
