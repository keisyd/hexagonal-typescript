import { createRegisterTransaction } from '@business'
import * as m from '@models'
import moment from 'moment'
import { validateRegisterRequest } from './register'

const registerRequest: m.RegisterRequest = {
  personalId: '107034417-88',
  operation: m.OperationType.REGISTER,
  serviceOrigin: 'REGISTER',
  token: 'fasd8jhvah8dfasvdadfas'
}

describe('validateRegisterRequest', () => {
  test('expected register Request', () => {
    expect(validateRegisterRequest(registerRequest)).toBe(registerRequest)
  })
})

describe('createRegisterTransaction', () => {
  const transactionTime: string = moment.now().toString()
  const createdTransaction: m.Transaction = {
    walletId: registerRequest.personalId,
    destinationId: '',
    originId: '',
    operation: m.OperationType.REGISTER,
    serviceOrigin: 'REGISTER',
    status: m.TransactionStatus.SUCCESS,
    amount: 0,
    previousAmount: 0,
    amountTransacted: 0,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }
  test('expected create Request', () => {
    expect(createRegisterTransaction(registerRequest, transactionTime)).toBe(createdTransaction)
  })
})
