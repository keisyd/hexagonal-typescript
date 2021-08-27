import R from 'ramda'
import { Request } from 'express'
import { LoggerInstance } from '@ports/logger'
import { AdapterFacade } from '@adapters'
import { Transaction } from '@models'
import { EClassError, throwCustomError } from '@utils'

/**
 * @description Get Transaction by walletId
 *
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter adapter instantiated
 * @returns {ControllerTransactionReturn}
 */
export const getTransaction = (logger: LoggerInstance, adapter: AdapterFacade) => async (req: Request): Promise<Transaction> => {
  const methodPath = 'api.controllers.transaction.getTransaction'
  try {
    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const transaction = await adapter.transaction.getTransaction(req.params.id)
    if (R.isNil(transaction)) {
      return throwCustomError(new Error('id not found'), methodPath, EClassError.USER_ERROR)
    }
    return transaction
  } catch (error) {
    logger.error(methodPath, error)
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}

/**
 * @description Create Task
 *
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter adapter instantiated
 */
export const createTransaction = (logger: LoggerInstance, adapter: AdapterFacade) => async (req: Request) => {
  const methodPath = 'api.controller.transaction.createTransaction'
  try {
    /**
     * transaction validate body
     */

    /**
     * disclaimer : the user in production environment,
     * user will be sent by the midlleware authentication who call the method on http
     */
    const transaction = await adapter.transaction.createTransaction(req.body.data)
    return transaction
  } catch (error) {
    logger.error(methodPath, error)
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
