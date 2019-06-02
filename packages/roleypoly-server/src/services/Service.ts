// @flow
import { Logger } from '../logger'
import { AppContext } from '../Roleypoly'

export default class Service {
  // @ts-ignore log is used in sub-classes
  protected log: Logger = new Logger(this.constructor.name)
  constructor (public ctx: AppContext) {}
}
