import { Request } from 'express'
import { LoggerInstance } from '@ports/logger'
import { AdapterFacade } from '@adapters'
import { EClassError, throwCustomError } from '@utils'
import { OperationRequest } from '@models'

/**
 * @description Create Task
 *
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter adapter instantiated
 */
export const credit = (logger: LoggerInstance, adapter: AdapterFacade) => async (req: Request) => {
  const methodPath = 'api.controller.credit.credit'
  try {
    return await adapter.credit.credit(req.body.data as OperationRequest)
  } catch (error) {
    logger.error(methodPath, error)
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
