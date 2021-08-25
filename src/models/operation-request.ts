import { OperationType, Service } from "./operations"

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
  readonly amount: number
  /**
 * @description
 * Serviço UUDI que dá origem (justificativa) para a transação
 */
  readonly serviceOrigin: Service
  /**
 * @description
 * Tipo de operação atômica crédito ou débito
 */
  readonly operation: OperationType
}



