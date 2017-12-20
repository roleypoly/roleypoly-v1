const Service = require('./Service')
const LRU = require('lru-cache')

class PresentationService extends Service {
  constructor (ctx) {
    super(ctx)
    this.M = ctx.M
    this.discord = ctx.discord

    this.cache = LRU({ max: 500, maxAge: 100 * 60 * 5 })
  }

  async oldPresentableServers (collection, userId) {
    let servers = []

    for (let server of collection.array()) {
      const sd = await this.ctx.server.get(server.id)
      console.log(sd.categories)
      const gm = server.members.get(userId)

      servers.push({
        id: server.id,
        gm: {
          nickname: gm.nickname,
          color: gm.displayHexColor
        },
        server: {
          id: server.id,
          name: server.name,
          ownerID: server.ownerID,
          icon: server.icon
        },
        roles: (await this.rolesByServer(server, sd)).map(r => ({ ...r, selected: gm.roles.has(r.id) })),
        message: sd.message,
        categories: sd.categories,
        perms: this.discord.getPermissions(gm)
      })
    }

    return servers
  }

  async rolesByServer (server) {
    return server.roles
    .filter(r => r.id !== server.id) // get rid of @everyone
    .map(r => ({
      id: r.id,
      color: r.color,
      name: r.name,
      position: r.position
    }))
  }
}

module.exports = PresentationService
