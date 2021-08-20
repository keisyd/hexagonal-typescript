import { root } from "@business";
import { nullCheck } from "@utils";
import Joi from "joi";
import {
  Debit, Transaction, OperationType, Service, Transfer
} from "../models";
import { validateSchema } from "./schema";
import { transactionForDebit } from "./transaction";

export const debit = Joi.object<Debit>({
  accountID: Joi.string().required(),
  amount: Joi.number().integer().min(0),
  service: Joi.string().invalid(...Object.values(Service.DEPOSIT)).valid(...Object.values(Service)),
  operation: Joi.string().valid(...Object.values(OperationType.DEBIT)),
});

const namespace:string = `${root}.debit`

/**
 * @description Validate a Debit event on creating and return a transaction
 * @function
 * @param {Debit} [debitRequest] input data for create debit operation
 * @returns {Transaction}
 */
export const validateDebit = (
  debitRequest: Debit,
): Transaction => {
  const methodPath = `${namespace}.validateDebit`;

  nullCheck(debitRequest, methodPath);

  validateSchema(debit.validate(debitRequest), methodPath);

  const transaction = transactionForDebit(debitRequest);

  return transaction;
};





