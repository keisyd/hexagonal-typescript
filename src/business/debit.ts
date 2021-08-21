import { root, toISOString } from "@business";
import { nullCheck } from "@utils";
import Joi from "joi";
import {
  Debit, Transaction, OperationType, Service, TransactionStatus
} from "../models";
import { v4 as uuidv4 } from "uuid";
import { validateSchema } from "./schema";

const namespace:string = `${root}.debit`

export const debit = Joi.object<Debit>({
  accountID: Joi.string().required(),
  amount: Joi.number().integer().min(0),
  service: Joi.string().invalid(...Object.values(Service.DEPOSIT)).valid(...Object.values(Service)),
  operation: Joi.string().valid(...Object.values(OperationType.DEBIT)),
});

/**
 * @description Validate a Debit event on creating and return a transaction
 * @function
 * @param {Debit} [debitRequest] input data for create debit operation
 * @returns {Transaction}
 */
export const validateDebitRequest = (
  debitRequest: Debit,
): Transaction => {
  const methodPath = `${namespace}.validateDebit`;

  nullCheck(debitRequest, methodPath);

  validateSchema(debit.validate(debitRequest), methodPath);

  const transaction = transactionForDebit(debitRequest, TransactionStatus.PENDING);

  return transaction;
};

/**
 * @description Validate a Debit event on creating and return a transaction
 * @function
 * @param {Debit} [debitRequest] input data for create debit operation
 * @returns {Transaction}
 */
 export const validateDebitWallet = (
  debitRequest: Debit,
): Transaction => {
  const methodPath = `${namespace}.validateDebit`;

  nullCheck(debitRequest, methodPath);

  validateSchema(debit.validate(debitRequest), methodPath);

  const transaction = transactionForDebit(debitRequest, TransactionStatus.PENDING);

  return transaction;
};

/**
 * @description Create a Transaction for a Debit Operation
 * @function
 * @param {Debit} [data] input data for create task
 * @returns {Transaction}
 */
 export const transactionForDebit = (
  data: Debit,
  status: TransactionStatus
  ): Transaction => {
  const methodPath = `${namespace}.createForDebit`;

  const createdAt = toISOString();

  const updatedAt = createdAt;

  nullCheck(data, methodPath);

  const transaction: Transaction = {
    // default values if is missing
    destinationID:"UUDI DEFAULT", //!TODO: Insert a defatult from env
    originID: data.accountID,
    operation: OperationType.DEBIT,
    amount: data.amount,
    service: data.service,
    status: status,
    createdAt,
    updatedAt,
    // information from system
    id: uuidv4(),
  };

  return transaction;
};





