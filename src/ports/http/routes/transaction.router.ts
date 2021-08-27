import { AdapterFacade } from '@adapters'
import { Router } from 'express'
import { response } from './utils'
import { LoggerInstance } from '@ports/logger'
import controllers from '@ports/http/controllers'

const router = Router()

/**
 * @description Define the transaction routes.
 *
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter instantiated adapter
 * @returns {Router}
 */

export const transactionRouter = (logger: LoggerInstance, adapter: AdapterFacade): Router => {
  /**
   * get task with existing id
   */
  router.get('/:id', (req, res) => response(controllers.transaction.getTransaction(logger, adapter)(req), res))

  /**
   * create task with existing id
   */
  router.post('/', (req, res) => response(controllers.transaction.createTransaction(logger, adapter)(req), res))

  return router
}
