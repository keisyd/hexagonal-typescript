import { OperationType, Service } from '@models'

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
