const Logger = require('../logger')

class Service {
  constructor (ctx) {
    this.ctx = ctx
    this.log = new Logger(this.constructor.name)
  }
}

module.exports = Service
