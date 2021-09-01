import { OperationType } from '@models'
/**
 * @description The debit object
 * @export
 */
export type RegisterRequest = {
  /**
   * @description
   * Id único da pessoa física ou jurídica
   */
  readonly personalId: string
  /**
   * @description
   * Tipo de operação básica
   */
  readonly operation: OperationType
  /**
   * @description
   * Serviço que deu origem à operação
   */
  readonly serviceOrigin: string
  /**
    * @description
    * Bearer Token
    */
  readonly token: string
}
