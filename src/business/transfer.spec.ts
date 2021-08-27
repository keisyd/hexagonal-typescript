import { createCreditRequest } from '@business'
import * as m from '@models'

const uudiDefaultToken: string = '45d1e421-ce88-467f-bb43-b791f18c374a'
const walletId: string = '55d1e421-ce55-457f-bb43-b791f18c374a'
const random: string = '79d1e421-ce55-457f-bb43-b791f18c374a'
// const currentAmount: number = 100
const transactionAmount: number = 20
const previousAmount: number = 20
const token: string = '80d1e421-ce45-457f-cc43-ce54f18c374a'
// const lastTime: string = '2020-06-01T12:00:00Z'
const transactionTime: string = '2020-06-01T12:00:00Z'

describe('createCreditRequest', () => {
  // const methodPath = "createCreditRequest.test";
  const transaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: random,
    operation: m.OperationType.CREDIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: m.TransactionStatus.FAIL,
    amount: previousAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }

  const data: m.OperationRequest = {
    originId: random,
    destinationId: walletId,
    amount: transactionAmount,
    serviceOrigin: m.Service.TRANSFER,
    operation: m.OperationType.DEBIT,
    requester: m.ServiceRequester.CORE,
    token: token
  }

  const result: m.OperationRequest = {
    originId: random,
    destinationId: walletId,
    amount: transactionAmount,
    serviceOrigin: m.Service.TRANSFER,
    operation: m.OperationType.CREDIT,
    requester: m.ServiceRequester.CORE,
    token: 'undefined.token.generateToken at undefined.trasnfer.createDebitTransaction the most secure token ever, with the date, even: 2020-06-01T12:00:00Z'
  }

  test('Expected createCreditRequest', () => {
    expect(createCreditRequest(data, transaction)).toMatchObject(result)
  })

  const utransaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.DEBIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: m.TransactionStatus.FAIL,
    amount: previousAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }
  const udata: m.OperationRequest = {
    originId: walletId,
    destinationId: walletId,
    amount: transactionAmount,
    serviceOrigin: m.Service.DEPOSIT,
    operation: m.OperationType.CREDIT,
    requester: m.ServiceRequester.CORE,
    token: token
  }

  test('Unexpected credit', () => {
    try {
      createCreditRequest(udata, utransaction)
    } catch (e) {
      expect(e.message).toBe('"serviceOrigin" contains an invalid value')
    }
  })
})
