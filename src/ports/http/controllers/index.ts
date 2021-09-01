import * as debit from './debit.controller'
import * as index from './index.controller'
import * as credit from './credit.controller'
import * as register from './register.controller'
const controllers = {
  index: {
    ping: index.ping
  },
  credit: {
    credit: credit.credit
  },
  debit: {
    debit: debit.debit
  },
  register: {
    register: register.register
  }
}

export default controllers
