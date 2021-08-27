import { EClassError, throwCustomError } from '@utils'
import R from 'ramda'
import Joi from 'joi'

/**
 * @description Validate a transaction event on creation
 * @function
 * @param {CreatetransactionInput} [data] input data for create task
 * @param {string} [owner] owner of the task
 * @returns {transaction}
 */
export const validateSchema = <T>(
  object: T,
  validation: Joi.ValidationResult,
  methodPath: string
): T => {
  if (!R.isNil(validation.error)) {
    return throwCustomError(
      validation.error,
      methodPath,
      EClassError.USER_ERROR
    )
  }
  return object
}
