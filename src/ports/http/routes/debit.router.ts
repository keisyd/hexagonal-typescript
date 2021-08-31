import { AdapterFacade } from '@adapters'
import { Router } from 'express'
import { response } from './utils'
import { LoggerInstance } from '@ports/logger'
import controllers from '@ports/http/controllers'

const router = Router()

/**
 * @description Define the debit routes.
 *
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter instantiated adapter
 * @returns {Router}
 */

export const debitRouter = (logger: LoggerInstance, adapter: AdapterFacade): Router => {
  /**
   * Create a debit transaction to the destination Wallet
   */
  router.post('/', (req, res) => response(controllers.debit.debit(logger, adapter)(req), res))

  return router
}
