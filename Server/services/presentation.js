const Service = require('./Service')
const LRU = require('lru-cache')

class PresentationService extends Service {
  constructor (ctx) {
    super(ctx)
    this.M = ctx.M
    this.discord = ctx.discord

    this.cache = LRU({ max: 500, maxAge: 100 * 60 * 5 })
  }

  oldPresentableServers (collection, userId) {
    return collection.map((server) => {
      const gm = server.members.get(userId)

      return {
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
        roles: server.roles.filter(r => r.id !== server.id).map(r => ({
          id: r.id,
          color: r.color,
          name: r.name,
          selected: gm.roles.has(r.id),
          position: r.position
        })),
        message: 'moe moe kyuuuuuuuuun~',
        perms: this.discord.getPermissions(gm)
      }
    })
  }

  rolesByServer (serverId, userId) {
    // get from discord, merge with server categories
  }


}

module.exports = PresentationService
