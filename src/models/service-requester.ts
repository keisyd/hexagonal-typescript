export enum ServiceRequester {
  CORE = 'CORE',
  ATOM = 'ATOM',
  /**
 * @description
 * Operação de débito baseado
 * num saque
 */
  WITHDRAW = "WITHDRAW",
  /**
 * @description
 * Operação de crédito baseado
 * num depósito
 */
  DEPOSIT = "DEPOSIT",
  /**
 * @description
 * Operação de crédito ou débito baseado
 * num cashback
 */
  CASHBACK = "CASHBACK",
  /**
 * @description
 * Operação de débito baseado
 * na compra de um produto vendido
 * na UUDI
 */
  PURCHASE = "PURCHASE",
  /**
 * @description
 * Operação de crédito ou débito baseado
 * numa transferência entre carteiras
 */
  TRANSFER = "TRANSFER",
  /**
 * @description
 * Operação de débito baseado
 * na compra de um produto vendido
 * na UUDI
 */
  PAYMENT = "PAYMENT",
  /**
 * @description
 * Operação de crédito ou débito baseado
 * numa transferência entre carteiras
 */
  PIX = "PIX",

  REFUNDING = "REFUNDING",
}
