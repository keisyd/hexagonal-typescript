import { EClassError, throwCustomError } from "@utils";
import Joi from "joi";
import R from "ramda";
import { Wallet } from "../models";

/// Joi is The most powerful schema description language
/// and data validator for JavaScript

/**
 * @description Validate a Todo event on creation
 * @function
 * @param {integerType} [amount] input data for create task
 * @returns {void}
 */
export const validateAmount = (wallet: Wallet): Wallet => {
  const methodPath = "business.finance.validateTransferAmount";

  if (R.isNil(wallet.amount.amount) || R.isEmpty(wallet.amount.amount)) {
    return throwCustomError(
      new Error("Amount not set."),
      methodPath,
      EClassError.USER_ERROR
    );
  }

  if (wallet.amount.amount < 0) {
    return throwCustomError(
      new Error("Amount cant' be negative"),
      methodPath,
      EClassError.USER_ERROR
    );
  }

  if (wallet.amount.amount == 0) {
    return throwCustomError(
      new Error("Amount have to be greater than zero."),
      methodPath,
      EClassError.USER_ERROR
    );
  }

  return wallet;
};
