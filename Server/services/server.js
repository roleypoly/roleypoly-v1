const Service = require('./Service')

class ServerService extends Service {
  constructor (ctx) {
    super(ctx)
    this.Server = ctx.M.Server
    this.P = ctx.P
  }

  async ensure (server) {
    const srv = await this.get(server.id)
    if (srv == null) {
      return this.create({
        id: server.id,
        message: '',
        categories: {}
      })
    }
  }

  create ({ id, message, categories }) {
    const srv = this.Server.build({ id, message, categories })

    return srv.save()
  }

  update (id, newData) {
    const srv = this.get(id)

    return srv.update(newData)
  }

  async get (id) {
    return (await this.Server.findOne({
      where: {
        id
      }
    })).get({ plain: true })
  }
}

module.exports = ServerService
