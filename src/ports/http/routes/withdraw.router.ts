import { AdapterFacade } from '@adapters'
import { Router } from 'express'
import { response } from './utils'
import { LoggerInstance } from '@ports/logger'
import controllers from '@ports/http/controllers'

const router = Router()

/**
 * @description Define the withdraw routes.
 *
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter instantiated adapter
 * @returns {Router}
 */

export const withdrawRouter = (logger: LoggerInstance, adapter: AdapterFacade): Router => {
  /**
   * Withdraw money (money from outside) into the given wallet
   */
  router.post('/', (req, res) => response(controllers.withdraw.withdraw(logger, adapter)(req), res))

  return router
}
