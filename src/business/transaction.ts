

import { root } from "@business";
import { Credit } from "@models/credit";
import { OperationType, Service } from "@models/operations";
import { EClassError, nullCheck, throwCustomError } from "@utils";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import {
  Debit, Transaction, TransactionStatus, Transfer
} from "../models";
import { toISOString } from "./moment";
import { validateSchema } from "./schema";

const transactionSchema = Joi.object<Transaction>({
  originID: Joi.string().required(),
  destinationID: Joi.string().required(),
  amount: Joi.number().integer().min(0),
  service: Joi.string().valid(...Object.values(Service)),
  operation: Joi.string().valid(...Object.values(OperationType)),
});

const namespace = `${root}.transactions`


/**
 * @description Create a Transaction for a Debit Operation
 * @function
 * @param {Debit} [data] input data for create task
 * @returns {Transaction}
 */
export const transactionForDebit = (
  data: Debit,
  ): Transaction => {
  const methodPath = `${namespace}.createForDebit`;

  const createdAt = toISOString();

  const updatedAt = createdAt;

  nullCheck(data, methodPath);

  const transaction: Transaction = {
    // default values if is missing
    destinationID:"UUDI DEFAULT", //!TODO: Insert a defatult from env
    originID: data.accountID,
    ...data,
    status:TransactionStatus.PENDING,
    createdAt,
    updatedAt,
    // information from system
    id: uuidv4(),
  };

  validateSchema(transactionSchema.validate(transaction), methodPath);

  return transaction;
};

/**
 * @description Create a Transaction for a Credit Operation
 * @function
 * @param {Credit} [data] input data for create task
 * @returns {Transaction}
 */
 export const transactionForCredit = (
  data: Credit,
  ): Transaction => {
  const methodPath = `${namespace}.createForCredit`;

  const createdAt = toISOString();

  const updatedAt = createdAt;

  nullCheck(data, methodPath);

  const transaction: Transaction = {
    // default values if is missing
    destinationID:"UUDI DEFAULT", //!TODO: Insert a defatult from env
    originID: data.accountID,
    ...data,
    status:TransactionStatus.PENDING,
    createdAt,
    updatedAt,
    // information from system
    id: uuidv4(),
  };

  validateSchema(transactionSchema.validate(transaction), methodPath);

  return transaction;
};

/**
 * @description Create a Transaction for a Credit Operation
 * @function
 * @param {Credit} [data] input data for create task
 * @returns {Transaction}
 */
 export const transactionForTransfer = (
  data: Transfer
  ): Transaction => {
  const methodPath = `${namespace}.createForCredit`;

  const createdAt = toISOString();

  const updatedAt = createdAt;

  nullCheck(data, methodPath);

  const transaction: Transaction = {
    // default values if is missing
    ...data,
    operation: OperationType.TRANSFER,
    status:TransactionStatus.PENDING,
    createdAt,
    updatedAt,
    // information from system
    id: uuidv4(),
  };

  validateSchema(transactionSchema.validate(transaction), methodPath);

  return transaction;
};

