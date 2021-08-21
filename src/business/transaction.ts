import Joi from "joi";
import { Transaction, OperationType, Service,
} from "@models";
import { root,toISOString,validateSchema } from "@business";
import { nullCheck } from "@utils";
import { v4 as uuidv4 } from "uuid";


const namespace = `${root}.transactions`

const transactionSchema = Joi.object<Transaction>({
  originID: Joi.string().required(),
  destinationID: Joi.string().required(),
  amount: Joi.number().integer().min(0),
  service: Joi.string().valid(...Object.values(Service)),
  operation: Joi.string().valid(...Object.values(OperationType)),
});

/**
 * @description Create a Transaction for a Debit Operation
 * @function
 * @param {Debit} [data] input data for create task
 * @returns {Transaction}
 */
export const validateTransaction = (
  transaction: Transaction,
  ): Transaction => {
  const methodPath = `${namespace}.validateTransaction`;

  const createdAt = toISOString();

  nullCheck(transaction, methodPath);

  transaction = {
    // default values if is missing
    ...transaction,
    createdAt:createdAt,
    updatedAt: createdAt,
    // information from system
    id: uuidv4(),
  };

  nullCheck(transaction, methodPath);

  validateSchema(transactionSchema.validate(transaction), methodPath);

  return transaction;
};
