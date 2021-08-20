import { DateTime } from "aws-sdk/clients/devicefarm";
import { ModelBase } from "./base";
/**
 * @description The final user Wallet
 * @export
 */
export type Wallet = ModelBase & {
  readonly amount: Amount; // virtual field
  readonly username: string;
  readonly entityId: string;
  readonly status: WalletStatus;
};

export enum WalletStatus {
  VALIDATED = "VALIDATED",
  BLOCKED = "BLOCKED",
  IN_VALIDATION = "IN_VALIDATION",
}

export type Amount = {
  readonly amount: number; // virtual field
  readonly offset: string;
  readonly calculetedIn: DateTime;
  // getAmount() takes the amount from ksql
};
