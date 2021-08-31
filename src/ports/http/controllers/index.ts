import * as debit from './debit.controller'
import * as index from './index.controller'
import * as credit from './credit.controller'

const controllers = {
  index: {
    ping: index.ping
  },
  credit: {
    credit: credit.credit
  },
  debit: {
    debit: debit.debit
  }
}

export default controllers
