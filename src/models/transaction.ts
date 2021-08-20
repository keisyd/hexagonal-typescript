import { ModelBase } from "./base";
import { OperationType, Service } from "./operations";
/**
 * @description The debit object
 * @export
 */
export type Transaction = ModelBase & {
  readonly originID: string
  readonly destinationID: string
  readonly operation: OperationType
  readonly amount: number
  readonly service: Service
  readonly status: TransactionStatus
  readonly createdAt: string
  readonly updatedAt: string
};

export enum TransactionStatus{
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}
