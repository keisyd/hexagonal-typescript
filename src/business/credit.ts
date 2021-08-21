import { root, toISOString } from "@business";
import { nullCheck } from "@utils";
import Joi from "joi";
import {
  Credit, Transaction, OperationType, Service, Transfer
} from "../models";
import { validateSchema } from "./schema";
import { v4 as uuidv4 } from "uuid";
import { validateTransaction } from "./transaction";

const namespace:string = `${root}.credit`

export const credit = Joi.object<Credit>({
  accountID: Joi.string().required(),
  amount: Joi.number().integer().min(0),
  service: Joi.string().invalid(...Object.values(Service.WITHDRAW)).valid(...Object.values(Service)),
  operation: Joi.string().valid(...Object.values(OperationType.CREDIT)),
});

/**
 * @description Validate a credit event on creating and return a transaction
 * @function
 * @param {credit} [creditRequest] input data for create credit operation
 * @returns {Transaction}
 */
export const validateCredit = (
  creditRequest: Credit,
): Transaction => {
  const methodPath = `${namespace}.validateCredit`;

  nullCheck(creditRequest, methodPath);

  validateSchema(credit.validate(creditRequest), methodPath);

  const transaction = transactionForCredit(creditRequest);

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

  validateTransaction(transaction);

  return transaction;
};
