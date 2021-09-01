import { Request } from 'express'
import { LoggerInstance } from '@ports/logger'
import { AdapterFacade } from '@adapters'
import { EClassError, throwCustomError } from '@utils'
import { RegisterRequest } from '@models'

/**
 * @description Create Task
 *
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter adapter instantiated
 */
export const register = (logger: LoggerInstance, adapter: AdapterFacade) => async (req: Request) => {
  const methodPath = 'api.controller.register.register'
  try {
    return await adapter.register.register(req.body.data as RegisterRequest)
  } catch (error) {
    logger.error(methodPath, error)
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
