import { root } from "@business";
import { nullCheck } from "@utils";
import Joi from "joi";
import {
  Transfer, Transaction, OperationType, Service, Debit, Credit
} from "../models";
import { credit, validateCredit } from "./credit";
import { debit, validateDebit } from "./debit";
import { validateSchema } from "./schema";
import { transactionForTransfer } from "./transaction";

const Transfer = Joi.object<Transfer>({
  originID: Joi.string().required(),
  destinationID: Joi.string().required(),
  amount: Joi.number().integer().min(0),
  service: Joi.string().invalid([Service.DEPOSIT,Service.WITHDRAW]).valid(...Object.values(Service)),
});

const namespace:string = `${root}.transfer`

/**
 * @description Validate a Transfer event on creating and return a transaction
 * @function
 * @param {Transfer} [TransferRequest] input data for create Transfer operation
 * @returns {Transaction}
 */
export const validateTransfer = (
  TransferRequest: Transfer,
): Transaction => {
  const methodPath = `${namespace}.validateTransfer`;

  nullCheck(TransferRequest, methodPath);

  validateSchema(Transfer.validate(TransferRequest), methodPath);

  const transaction = transactionForTransfer(TransferRequest);

  return transaction;
};

/**
 * @description Create a valid debit request from transfer request
 * @function
 * @param {Transfer} [transferRequest] input data for create debit operation
 * @returns {[Debit, Transaction] }
 */
 export const debitForTransfer = (
  transferRequest: Transfer,
): [Debit, Transaction] => {
  const methodPath = `${namespace}.validateDebit`;

  nullCheck(transferRequest, methodPath);

  const debitRequest: Debit = {
    accountID: transferRequest.originID,
    amount: transferRequest.amount,
    service: Service.TRANSFER,
    operation:OperationType.DEBIT
  }

  const transaction: Transaction = validateDebit(debitRequest);

  return [debitRequest, transaction];
};

/**
 * @description Create a valid credit request from transfer request
 * @function
 * @param {Transfer} [transferRequest] input data for create transfer
 * @returns {[Credit, Transaction]}
 */
 export const creditForTransfer = (
  transferRequest: Transfer,
): [Credit, Transaction] => {
  const methodPath = `${namespace}.validatecredit`;

  nullCheck(transferRequest, methodPath);

  const creditRequest: Credit = {
    accountID: transferRequest.originID,
    amount: transferRequest.amount,
    service: Service.TRANSFER,
    operation:OperationType.CREDIT
  }

  const transaction: Transaction = validateCredit(creditRequest);

  return [creditRequest, transaction];
};
