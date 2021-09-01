import { RegisterRequest, Transaction } from '@models'
import { EClassError, throwCustomError } from '@utils'
import {
  createRegisterTransaction, toISOString
} from '@business'
import { AdapterFacadeTransaction, root } from '@adapters'
import moment from 'moment-timezone'

const namespace: string = `${root}.transaction`

export type RegisterAdapterInstance = {
  readonly register: (req: RegisterRequest) => Promise<Transaction | null>
}

/**
 * @description Register adapter factory
 * @memberof adapters
 * @function
 * @param {DynamoRepositoryInstance<Transaction>} repository Dynamo database methods
 */
const registerAdapterFactory = (
  adapter: AdapterFacadeTransaction
): RegisterAdapterInstance => ({
  register: register(adapter)
})

export default registerAdapterFactory

export const register = (adapter: AdapterFacadeTransaction) => async (req: RegisterRequest): Promise<Transaction> => {
  const methodPath = `${namespace}.register`

  try {
    // TODO Validar Existëncia do personalId (cpf ou cnpj, a princcipio)
    return await adapter.transaction.insertTransaction(
      createRegisterTransaction(
        req,
        toISOString(moment())
      )
    )
  } catch (error) {
    return throwCustomError(error, methodPath, EClassError.INTERNAL)
  }
}
