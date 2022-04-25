import { createDebitTransaction, debit } from '@business'
import * as m from '@models'
import moment from 'moment'

describe('debit', () => {
  const greater: number = 3
  const positive: number = 1
  const negative: number = -1

  test('valid values', () => {
    expect(debit(greater, positive)).toBe(greater - positive)
  })

  test('Negative currentAmount', () => {
    try {
      debit(negative, positive)
    } catch (e: any) {
      expect(e.message).toBe("Can't operate negative amount.")
    }
  })

  test('Negative transactionAmount', () => {
    try {
      debit(positive, negative)
    } catch (e: any) {
      expect(e.message).toBe("Can't operate negative amount.")
    }
  })

  test('transactionAmount > currentAmount', () => {
    try {
      debit(positive, greater)
    } catch (e: any) {
      expect(e.message).toBe("Can't debit. The currentAmount must be greater than transactionAmount")
    }
  })
})

describe('createDebitTransaction', () => {
  const uudiDefaultToken: string = '45d1e421-ce88-467f-bb43-b791f18c374a'
  const walletId: string = '55d1e421-ce55-457f-bb43-b791f18c374a'
  const random: string = '79d1e421-ce55-457f-bb43-b791f18c374a'
  const currentAmount: number = 100
  const transactionAmount: number = 20
  const token: string = '80d1e421-ce45-457f-cc43-ce54f18c374a'
  const lastTime: string = '2020-06-01T12:00:00Z'
  const transactionTime: string = moment.now().toString()

  const lastTransaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.DEBIT,
    serviceOrigin: 'DEPOSIT',
    status: m.TransactionStatus.SUCCESS,
    amount: currentAmount,
    previousAmount: 0,
    amountTransacted: currentAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: lastTime
  }

  test('expected output', () => {
    const data: m.OperationRequest = {
      originId: walletId,
      destinationId: uudiDefaultToken,
      amount: transactionAmount,
      serviceOrigin: 'WITHDRAW',
      operation: m.OperationType.DEBIT,
      token: token
    }

    const resultTransaction: m.Transaction = {
      walletId: walletId,
      destinationId: uudiDefaultToken,
      originId: walletId,
      operation: m.OperationType.DEBIT,
      serviceOrigin: data.serviceOrigin,
      status: m.TransactionStatus.SUCCESS,
      amount: currentAmount - transactionAmount,
      previousAmount: currentAmount,
      amountTransacted: transactionAmount,
      walletStatus: m.WalletStatus.VALIDATED,
      transactionTime: transactionTime
    }

    const result = createDebitTransaction(data, lastTransaction, transactionTime)

    expect(result).toMatchObject(resultTransaction)
  })

  test('Request with random destinatioId', () => {
    const data: m.OperationRequest = {
      originId: walletId,
      destinationId: random,
      amount: transactionAmount,
      serviceOrigin: 'WITHDRAW',
      operation: m.OperationType.DEBIT,
      token: token
    }

    try {
      createDebitTransaction(data, lastTransaction, transactionTime)
    } catch (e: any) {
      expect(e.message).toBe('Inconsistent Debit Request. originId must match walletId of the last transaction')
    }
  })

  test('currentAmount smallet than the transactionAmount', () => {
    const data: m.OperationRequest = {
      originId: walletId,
      destinationId: random,
      amount: transactionAmount + currentAmount,
      serviceOrigin: 'WITHDRAW',
      operation: m.OperationType.DEBIT,
      token: token
    }

    try {
      createDebitTransaction(data, lastTransaction, transactionTime)
    } catch (e: any) {
      expect(e.message).toBe('Insuficient Funds')
    }
  })

  test('currentAmount smallet than the transactionAmount', () => {
    const data: m.OperationRequest = {
      originId: walletId,
      destinationId: random,
      amount: transactionAmount + currentAmount,
      serviceOrigin: 'WITHDRAW',
      operation: m.OperationType.DEBIT,
      token: token
    }

    try {
      createDebitTransaction(data, lastTransaction, transactionTime)
    } catch (e: any) {
      expect(e.message).toBe('Insuficient Funds')
    }
  })

  test('originId as random', () => {
    const data: m.OperationRequest = {
      originId: random,
      destinationId: walletId,
      amount: transactionAmount,
      serviceOrigin: 'WITHDRAW',
      operation: m.OperationType.DEBIT,
      token: token
    }

    try {
      createDebitTransaction(data, lastTransaction, transactionTime)
    } catch (e: any) {
      expect(e.message).toBe('Inconsistent Debit Request. originId must match walletId of the last transaction')
    }
  })
})
