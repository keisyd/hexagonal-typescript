import { OperationType, Service } from "./operations";

/**
 * @description The final user Transfer
 * @export
 */
export type Transfer = {
  readonly originID: string
  readonly destinationID: string
  readonly amount: number
  readonly service: Service
  readonly operation: OperationType
};
