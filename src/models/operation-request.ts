import { OperationType } from '@models'

/**
 * @description The final user Transfer
 * @export
 */
export type OperationRequest = {
  /**
  * @description
  * Id da carteira que sofrerá
  * subtração do valor transacionado
  */
  readonly originId: string
  /**
   * @description
   * Id da carteira que sofrerá
   * adição do valor transacionado
   */
  readonly destinationId: string
  /**
   * @description
   * Valor transacionado
   */
  readonly amount: number /// TODO: Create a validation for this amount never be zero or negative
  /**
   * @description
   * Serviço UUDI que dá origem (justificativa) para a transação
   */
  readonly serviceOrigin: string
  /**
   * @description
   * Tipo de operação atômica crédito ou débito
   */
  readonly operation: OperationType
  /**
    * @description
    * Tipo de operação atômica crédito ou débito
    */
  readonly token: string
}
