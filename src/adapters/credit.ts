import { DynamoRepositoryInstance } from "@ports/aws-dynamo"
import { Withdraw } from "@models"
import { EClassError, throwCustomError } from "@utils"
import { LoggerInstance } from "@ports/logger"

export type withdrawAdapterInstance = {
  readonly withdraw: (id: string) => Promise<withdraw | null>
}

/**
 * @description Todo adapter factory
 * @memberof adapters
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {DynamoRepositoryInstance<Todo>} repository Dynamo database methods
 */
const todoAdapterFactory = (
  logger: LoggerInstance,
  repository: DynamoRepositoryInstance<Withdraw>
): withdrawAdapterInstance => ({
  withdraw: withdraw(repository),
})

export default todoAdapterFactory

/**
 * @description Handler function to get todo data by id .
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Todo>} repository - Dynamo database methods.
 */
const withdraw = (repository: DynamoRepositoryInstance<withdraw>) => async (
  id: string
) => {
  /// @adpater buscareVerificarEBloquear 1 (withdraw)

  /// @adpater buscarVerificar 2 (deposit)

  /// business validarwithdraw(1, 2)

  /// enviar para outra carteira
  const methodPath = "adapters.balance-operations.withdraw"
  try {
    const result = await repository.getDocument({ id })
    return result.value
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
