/* import { validateTransaction } from '@business/transaction'
import { Transaction } from '@models'
import { EClassError, throwCustomError } from '@utils/errors'
import moment from 'moment'
import { v4 as uuidV4 } from 'uuid'
import transactionAdapterFactory from './transaction'

* mock error generation to validate signature
jest.mock('@utils/errors')
jest.mock('@business/transaction')

  ; (throwCustomError as any).mockImplementation((error: Error) => {
    // eslint-disable-next-line functional/no-throw-statement
    throw error
  })

  ; (validateTransaction as any).mockImplementation((args: any) => ({ ...args, taskStatus: .NEW, taskOwner: 'owner' }))

// mock logger calls
const loggerMock = {
  info: jest.fn((args) => (args)).mockReturnValue(undefined)
}

const now = moment().toISOString()
*/
