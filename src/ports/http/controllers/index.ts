import * as transaction from './transaction.controller'
import * as index from './index.controller'

const controllers = {
  index: {
    ping: index.ping
  },
  transaction: {
    createTransaction: transaction.createTransaction,
    getTransaction: transaction.getTransaction
  }
}

export default controllers
