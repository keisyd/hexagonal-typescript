import { AdapterFacade } from '@adapters'
import { Router } from 'express'
import { response } from './utils'
import { LoggerInstance } from '@ports/logger'
import controllers from '@ports/http/controllers'

const router = Router()

/**
 * @description Define the credit routes.
 *
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter instantiated adapter
 * @returns {Router}
 */

export const creditRouter = (logger: LoggerInstance, adapter: AdapterFacade): Router => {
  /**
   * Creates a credit transaction to the origin Wallet
   */
  router.post('/', (req, res) => response(controllers.credit.credit(logger, adapter)(req), res))

  return router
}
