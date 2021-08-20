import { DynamoRepositoryInstance } from "@ports/aws-dynamo";
import { Transfer } from "@models";
import { EClassError, throwCustomError } from "@utils";
import { validateUpdateTodo, validateDeleteTodo } from "@business/transfer";
import { LoggerInstance } from "@ports/logger";
import {} from "@models/transfer";

export type TransferAdapterInstance = {
  readonly transfer: (id: string) => Promise<Transfer | null>;
};

/**
 * @description Todo adapter factory
 * @memberof adapters
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {DynamoRepositoryInstance<Todo>} repository Dynamo database methods
 */
const todoAdapterFactory = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Transfer>
): TransferAdapterInstance => ({
  transfer: transfer(repository),
});

export default todoAdapterFactory;

/**
 * @description Handler function to get todo data by id .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Todo>} repository - Dynamo database methods.
 */
const transfer = (repository: DynamoRepositoryInstance<Transfer>) => async (
  id: string
) => {
  const methodPath = "adapters.balance-operations.transfer";
  /// @adpater buscareVerificarEBloquear 1 (withdraw)

  /// @adpater buscarVerificar 2 (deposit)

  /// business validarTransfer(1, 2)

  /// enviar para outra carteira
  try {
    const result = await repository.getDocument({ id });
    return result.value;
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL);
  }
};
