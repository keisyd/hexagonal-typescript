import { createCreditTransaction, credit } from '@business'
import * as m from '@models'

describe('credit', () => {
  const greater: number = 3
  const positve: number = 1
  const negative: number = -1

  test('expected sum', () => {
    expect(credit(greater, positve)).toBe(greater + positve)
  })

  test('negative currentAmount', () => {
    try {
      credit(negative, positve)
    } catch (e: any) {
      expect(e.message).toBe("Can't operate negative amount.")
    }
  })

  test('negative transactionAmount', () => {
    try {
      credit(positve, negative)
    } catch (e: any) {
      expect(e.message).toBe("Can't operate negative amount.")
    }
  })
})

describe('createCreditTransaction', () => {
  const uudiDefaultToken: string = '45d1e421-ce88-467f-bb43-b791f18c374a'
  const walletId: string = '55d1e421-ce55-457f-bb43-b791f18c374a'
  const random: string = '79d1e421-ce55-457f-bb43-b791f18c374a'
  const currentAmount: number = 100
  const transactionAmount: number = 20
  const token: string = '80d1e421-ce45-457f-cc43-ce54f18c374a'
  const lastTime: string = '2020-06-01T12:00:00Z'
  const transactionTime: string = '2020-06-01T12:00:00Z'

  const lastTransaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.CREDIT,
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
      originId: uudiDefaultToken,
      destinationId: walletId,
      amount: transactionAmount,
      serviceOrigin: 'DEPOSIT',
      operation: m.OperationType.CREDIT,
      token: token
    }

    const resultTransaction: m.Transaction = {
      walletId: walletId,
      destinationId: walletId,
      originId: uudiDefaultToken,
      operation: m.OperationType.CREDIT,
      serviceOrigin: 'DEPOSIT',
      status: m.TransactionStatus.SUCCESS,
      amount: currentAmount + transactionAmount,
      previousAmount: currentAmount,
      amountTransacted: transactionAmount,
      walletStatus: m.WalletStatus.VALIDATED,
      transactionTime: transactionTime
    }
    const result = createCreditTransaction(data, lastTransaction, transactionTime)

    expect(result).toMatchObject(resultTransaction)
  })

  test('Request with random destinatioId ', () => {
    const data: m.OperationRequest = {
      originId: walletId,
      destinationId: random,
      amount: transactionAmount,
      serviceOrigin: 'DEPOSIT',
      operation: m.OperationType.CREDIT,
      token: token
    }

    try {
      createCreditTransaction(data, lastTransaction, transactionTime)
    } catch (e: any) {
      expect(e.message).toBe('Inconsistent Credit Request. The destinationId must match walletId of the last transaction')
    }
  })
})
