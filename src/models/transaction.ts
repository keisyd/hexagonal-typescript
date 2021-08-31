import { TransactionStatus, WalletStatus, OperationType } from '@models'
/**
 * @description The debit object
 * @export
 */
export type Transaction = {
  /**
   * @description
   * Id único da carteira do usuário
   */
  readonly walletId: string
  /**
   * @description Data da transação
   */
  readonly transactionTime: string
  /**
   * @description
   * Status da carteira, para determinar
   * se estar habilitada ou não a proceder
   * a operação
   */
  readonly walletStatus: WalletStatus
  /**
   * @description
   * Valor da carteira na última transação
   */
  readonly previousAmount: number
  /**
   * @description
   * Valor transacionado
   */
  readonly amountTransacted: number
  /**
   * @description
   * Valor do saldo da carteira
   * para a transação
   */
  readonly amount: number
  /**
   * @description
   * Id da carteira que deu
   * origem à transação
   */
  readonly originId: string
  /**
   * @description
   * Id de destino da transação (beneficiário)
   */
  readonly destinationId: string
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
   * Status da transação,
   * representando o estágio
   * de processamento da operação.
   */
  readonly status: TransactionStatus
}
