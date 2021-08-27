import { getMultiplier, validateAmount, validateFailTransaction } from '@business'
import * as m from '@models'
import { validateSuccessTransaction, validateTransaction, validateTransactionSchema } from './transaction'

describe('validateAmount', () => {
  const methodPath = 'validateAmount.test'
  const greater: number = 3
  const negative: number = -1

  test('expected positive input', () => {
    expect(validateAmount(greater, methodPath)).toBe(greater)
  })

  test('negative currentAmount', () => {
    try {
      validateAmount(negative, methodPath)
    } catch (e) {
      expect(e.message).toBe("Can't operate negative amount.")
    }
  })
})

describe('getMultiplier', () => {
  /// const methodPath = "getMultiplier.test";
  const credit: m.OperationType = m.OperationType.CREDIT
  const debit: m.OperationType = m.OperationType.DEBIT

  test('expected credit', () => {
    expect(getMultiplier(credit)).toBe(1)
  })

  test('expected debit', () => {
    expect(getMultiplier(debit)).toBe(-1)
  })

  const op: any = ''
  test('Any unexpected value', () => {
    try {
      getMultiplier(op)
    } catch (e) {
      expect(e.message).toBe('No matching Operation Type')
    }
  })
})

const uudiDefaultToken: string = '45d1e421-ce88-467f-bb43-b791f18c374a'
const walletId: string = '55d1e421-ce55-457f-bb43-b791f18c374a'
// const random: string = "79d1e421-ce55-457f-bb43-b791f18c374a"
// const currentAmount: number = 100
const transactionAmount: number = 20
const previousAmount: number = 20
// const token: string = "80d1e421-ce45-457f-cc43-ce54f18c374a"
// const lastTime: string = '2020-06-01T12:00:00Z'
const transactionTime: string = '2020-06-01T12:00:00Z'

describe('validateFailTransaction', () => {
  const methodPath = 'validateFailTransaction.test'
  const transaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.CREDIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: m.TransactionStatus.FAIL,
    amount: previousAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }

  test('Expected trace (previous === amount)', () => {
    expect(validateFailTransaction(transaction, methodPath)).toBe(transaction)
  })

  test('Expected trace in validateTransaction', () => {
    expect(validateTransaction(transaction, methodPath)).toBe(transaction)
  })

  const utransaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.CREDIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: m.TransactionStatus.FAIL,
    amount: previousAmount + transactionAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }

  test('Unexpected credit', () => {
    try {
      validateFailTransaction(utransaction, methodPath)
    } catch (e) {
      expect(e.message).toBe('Invalid failed transaction. Must respect amount === previousAmount')
    }
  })
})

describe('validateSuccessTransaction', () => {
  const methodPath = 'validateSuccessTransaction.test'
  const transaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.CREDIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: m.TransactionStatus.SUCCESS,
    amount: transactionAmount + previousAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }

  test('expected Success Transaction in validateTransaction', () => {
    expect(validateTransaction(transaction, methodPath)).toBe(transaction)
  })

  test('expected Success Transaction', () => {
    expect(validateSuccessTransaction(transaction, methodPath)).toBe(transaction)
  })

  const utransaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.CREDIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: m.TransactionStatus.SUCCESS,
    amount: transactionAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }

  test('Unexpected credit', () => {
    try {
      validateSuccessTransaction(utransaction, methodPath)
    } catch (e) {
      expect(e.message).toBe('Invalid sucessfull transaction. Must respect amount = previousAmount + (operationType)*amountTransacted ')
    }
  })
})

describe('validateTransactionSchema', () => {
  const methodPath = 'validateTransactionSchema.test'
  const transaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.CREDIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: m.TransactionStatus.SUCCESS,
    amount: transactionAmount + previousAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }

  test('expected Success Transaction', () => {
    expect(validateTransactionSchema(transaction, methodPath)).toBe(transaction)
  })

  const utransaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.CREDIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: m.TransactionStatus.SUCCESS,
    amount: transactionAmount + previousAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: 'transactionTime'
  }

  test('Unexpected credit', () => {
    try {
      validateTransactionSchema(utransaction, methodPath)
    } catch (e) {
      expect(e.message).toBe('Date has to be unique, formated and in greater than the past.')
    }
  })
})

describe('validateTransaction', () => {
  const methodPath = 'validateTransaction.test'
  const a: any = ''
  const transaction: m.Transaction = {
    walletId: walletId,
    destinationId: walletId,
    originId: uudiDefaultToken,
    operation: m.OperationType.CREDIT,
    serviceOrigin: m.Service.DEPOSIT,
    status: a,
    amount: transactionAmount + previousAmount,
    previousAmount: previousAmount,
    amountTransacted: transactionAmount,
    walletStatus: m.WalletStatus.VALIDATED,
    transactionTime: transactionTime
  }

  test('Unexpected status', () => {
    try {
      validateTransaction(transaction, methodPath)
    } catch (e) {
      expect(e.message).toBe('"status" must be one of [SUCCESS, FAIL]')
    }
  })
})
