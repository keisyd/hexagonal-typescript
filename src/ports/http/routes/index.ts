import { AdapterFacade } from '@adapters'
import { LoggerInstance } from '@ports/logger'
import { Router } from 'express'
import { indexRouter } from './index.router'
import { debitRouter } from './debit.router'
import { creditRouter } from './credit.router'

/**
 * @description Get route definitions.
 *
 * @function
 * @param {LoggerInstance} logger instance of logger
 * @param {AdapterFacade} adapter instantiated adapter
 */
export const getRoutes = (logger: LoggerInstance, adapter: AdapterFacade): { readonly [key: string]: Router } => {
  return {
    index: indexRouter(logger),
    debit: debitRouter(logger, adapter),
    credit: creditRouter(logger, adapter)
  }
}
