import { AdapterFacade } from '@adapters'
import { Router } from 'express'
import { response } from './utils'
import { LoggerInstance } from '@ports/logger'
import controllers from '@ports/http/controllers'

const router = Router()

/**
 * @description Define the transfer routes.
 *
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter instantiated adapter
 * @returns {Router}
 */

export const transferRouter = (logger: LoggerInstance, adapter: AdapterFacade): Router => {
  /**
   * Transfer money from origin Wallet to destination wallet
   */
  router.post('/', (req, res) => response(controllers.transfer.transfer(logger, adapter)(req), res))

  return router
}
