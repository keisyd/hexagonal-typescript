import { root } from "@business";
import { nullCheck } from "@utils";
import Joi from "joi";
import {
  Credit, Transaction, OperationType, Service, Transfer
} from "../models";
import { validateSchema } from "./schema";
import { transactionForCredit } from "./transaction";

export const credit = Joi.object<Credit>({
  accountID: Joi.string().required(),
  amount: Joi.number().integer().min(0),
  service: Joi.string().invalid(...Object.values(Service.WITHDRAW)).valid(...Object.values(Service)),
  operation: Joi.string().valid(...Object.values(OperationType.CREDIT)),
});

const namespace:string = `${root}.credit`

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



