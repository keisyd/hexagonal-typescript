/**
 * @description
 * Status da carteira, para determinar
 * se estar habilitada ou não a proceder
 * a operação
 */
export enum WalletStatus {
  VALIDATED = "VALIDATED",
  BLOCKED = "BLOCKED",
  IN_VALIDATION = "IN_VALIDATION",
}
