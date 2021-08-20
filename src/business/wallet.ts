import { EClassError, throwCustomError } from "@utils";
import { integerType } from "aws-sdk/clients/iam";
import Joi from "joi";
import R from "ramda";
import { Wallet } from "../models";

/// Joi is The most powerful schema description language
/// and data validator for JavaScript
const todoSchema = Joi.object<Wallet>({
  amount: Joi.number().required(),
  username: Joi.string().required(),
  entityId: Joi.string().required(),
});

/**
 * @description Validate a Todo event on creation
 * @function
 * @param {integerType} [amount] input data for create task
 * @returns {void}
 */
export const validateAmount = (wallet: Wallet): void => {
  const methodPath = "business.finance.validateTransferAmount";
};
