const ksuid = require('ksuid')

module.exports = {
  ksuid (field = 'id') {
    return async function () {
      this.id = await ksuid.random()
      return this
    }
  }
}
