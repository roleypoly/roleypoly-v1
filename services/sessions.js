const Service = require('./Service')

class SessionsService extends Service {
  constructor (ctx) {
    super(ctx)
    this.Session = ctx.M.Session
  }

  async get (id, {rolling}) {
    const user = await this.Session.findOne({ where: { id } })

    if (user === null) {
      return null
    }

    return user.data
  }

  async set (id, data, {maxAge, rolling, changed}) {
    let session = await this.Session.findOne({ where: { id } })
    if (session === null) {
      session = this.Session.build({ id })
    }

    console.log(maxAge)

    session.data = data
    session.maxAge = maxAge

    return session.save()
  }

  async destroy (id) {
    const sess = await this.Session.findOne({ where: { id } })

    if (sess != null) {
      return sess.destroy()
    }
  }
}

module.exports = SessionsService
