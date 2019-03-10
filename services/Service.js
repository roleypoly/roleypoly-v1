// @flow
import { Logger } from '../logger'
import { type AppContext } from '../Roleypoly'

export default class Service {
  ctx: AppContext
  log: Logger
  constructor (ctx: AppContext) {
    this.ctx = ctx
    this.log = new Logger(this.constructor.name)
  }
}
