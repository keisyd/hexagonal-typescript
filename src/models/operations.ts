export enum Service {
  TRANSFER = "TRANSFER",
  CASHBACK = "CASHBACK",
  PAYMENT = "PAYMENT",
  PIX = "PIX",
  WITHDRAW = "WITHDRAW",
  DEPOSIT = "DEPOSIT",
}

export enum OperationType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
  TRANSFER = "TRANSFER",
}
/**
 * @description The minimum requirement to an atomic operation
 * @export
 */
export type Atom = {
  readonly accountID: string
  readonly amount: number
  readonly service: Service
  readonly operation: OperationType
}
