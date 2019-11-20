const Service = require('./Service')

class ServerService extends Service {
  constructor(ctx) {
    super(ctx)
    this.Server = ctx.M.Server
    this.P = ctx.P
  }

  async ensure(server) {
    let srv
    try {
      srv = await this.get(server.id)
    } catch (e) {}

    if (srv == null) {
      return this.create({
        id: server.id,
        message: '',
        categories: {},
      })
    }
  }

  create({ id, message, categories }) {
    const srv = this.Server.build({ id, message, categories })

    return srv.save()
  }

  async update(id, newData) {
    const srv = await this.get(id, false)

    return srv.update(newData)
  }

  async get(id, plain = true) {
    const s = await this.Server.findOne({
      where: {
        id,
      },
    })

    if (!plain) {
      return s
    }

    return s.get({ plain: true })
  }

  async getAllowedRoles(id) {
    const server = await this.get(id)

    return Object.values(server.categories).reduce((acc, c) => {
      if (c.hidden !== true) {
        return acc.concat(c.roles)
      }

      return acc
    }, [])
  }
}

module.exports = ServerService
