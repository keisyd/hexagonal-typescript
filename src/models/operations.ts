/**
* @description
* Serviços de pagamentos
* disponíveis para
* utilização na UUDI.

*/
export enum Service {
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
/**
 * @description
 * Operações básicas
 */
export enum OperationType {
  /**
 * @description
 * Operações de retirada de capital
 */
  DEBIT = "DEBIT",
  /**
   * @description
   * Operação de adição de capital
   */
  CREDIT = "CREDIT",
}
/**
 * @description
 * The minimum requirement to an atomic operation
 */
export type Atom = {
  /**
   * @description
   * O id da carteira que sofrerá a operação
   */
  readonly accountID: string
  /**
   * @description
   * O valor que será operado
   */
  readonly amount: number
  /**
   * @description
   * O serviço que deu origem à operação
   */
  readonly service: Service
  /**
   * @description
   * O tipo da operação (debit/-, credit/+)
   */
  readonly operation: OperationType
}
