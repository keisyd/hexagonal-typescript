import { AdapterFacade } from '@adapters'
import { Router } from 'express'
import { response } from './utils'
import { LoggerInstance } from '@ports/logger'
import controllers from '@ports/http/controllers'

const router = Router()

/**
 * @description Define the register routes.
 *
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter instantiated adapter
 * @returns {Router}
 */

export const registerRouter = (logger: LoggerInstance, adapter: AdapterFacade): Router => {
  /**
   * Creates a register register to the origin Wallet
   */
  router.post('/', (req, res) => response(controllers.register.register(logger, adapter)(req), res))

  return router
}
