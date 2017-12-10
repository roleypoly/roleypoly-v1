const Service = require('./Service')

class SessionsService extends Service {
  constructor (ctx) {
    super(ctx)
    this.Session = ctx.M.Session
  }

  async get (id) {
    const user = await this.Session.findOne({ where: { id } })

    if (user === null) {
      return null
    }

    return user.data
  }

  async set (id, data, maxAge) {
    let session = await this.Session.findOne({ where: { id } })
    if (session === null) {
      session = this.Session.build({ id })
    }

    session.data = data
    session.maxAge = maxAge

    return session.save()
  }

  async destroy (id) {
    return (await this.Session.findOne({ where: { id } })).destroy()
  }

}

module.exports = SessionsService
