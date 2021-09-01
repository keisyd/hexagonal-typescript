import { root } from '@business'
import { Transaction } from '@models'

const namespace: string = `${root}.token`

/**
 * @description
 * Creates a custom token
 * @function
 * @param {Transaction} [transaction]
 * @param {string} [originMethodPath]
 * @returns {string}
 */
/// transaction: Creates a real secure token
export const generateToken = (
  transaction: Transaction, originMethodPath: string
): string => {
  const methodPath = `${namespace}.generateToken at ${originMethodPath}`

  return `${methodPath} the most secure token ever, with the date, even: ${transaction.transactionTime}`
}

/**
 * @description
 * Creates a custom Wallet ID
 * @function
 * @param {string} [personalId]
 * @returns {string}
 */
/// transaction: Creates a real secure token
export const generateWalletId = (
  personalId: string
): string => {
  return personalId
  //! TODO Think about personalId Token
}
