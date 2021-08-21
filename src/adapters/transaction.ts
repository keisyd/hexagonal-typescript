import { DynamoRepositoryInstance } from "@ports/aws-dynamo";
import { Transaction } from "@models";
import { EClassError, throwCustomError } from "@utils";
import { LoggerInstance } from "@ports/logger";
import { root } from "@adapters";
import { validateTransaction } from "@business";

const namespace:string = `${root}.transaction`

export type TransactionAdapterInstance = {
  readonly getTransaction: (walletId: string) => Promise<Transaction | null>;
  readonly createTransaction: (id: Transaction) => Promise<Transaction | null>;
};

/**
 * @description Todo adapter factory
 * @memberof adapters
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {DynamoRepositoryInstance<Transaction>} repository Dynamo database methods
 */
const transactionAdapterFactory = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Transaction>,
): TransactionAdapterInstance => ({
  getTransaction: getTransaction(repository),
  createTransaction: createTransaction(repository),
});

export default transactionAdapterFactory;

/**
 * @description Handler function to get transaction data by wallet id .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Transaction>} repository - Dynamo database methods.
 */
const getTransaction = (repository: DynamoRepositoryInstance<Transaction>) => async (
  walletId: string
) => {
  const methodPath = `${namespace}.getTransaction`;
  try {
    const result = await repository.getDocument({ walletId });
    return result.value;
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL);
  }
};

/**
 * @description Handler function to get transaction data by wallet id .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Transaction>} repository - Dynamo database methods.
 */
const createTransaction = (repository: DynamoRepositoryInstance<Transaction>) => async (
  transaction: Transaction
) => {
  const methodPath = `${namespace}.createTransaction`;
  try {
    transaction = validateTransaction(transaction);

    const result = await repository.putDocument({ transaction });

    return result.value;
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL);
  }
};





