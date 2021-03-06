const Service = require('./Service')
const LRU = require('lru-cache')
const { Role } = require('@roleypoly/rpc/shared')

class PresentationService extends Service {
  constructor(ctx) {
    super(ctx)
    this.M = ctx.M
    this.discord = ctx.discord

    this.cache = new LRU({
      max: 500,
      maxAge: 1000 * 60 * 1,
    })
  }

  serverSlug(server) {
    return {
      id: server.id,
      name: server.name,
      ownerID: server.ownerID,
      icon: server.icon,
    }
  }

  presentableServers(userId) {
    return this.cacheCurry(`pss:${userId}`, async () => {
      const servers = await this.discord.getRelevantServers(userId)
      const transformedServers = []

      for (let server of servers) {
        const member = await this.discord.gm(server.id, userId)
        const transformedServer = await this.presentableServer(server, member)
        transformedServers.push(transformedServer)
      }

      return transformedServers
    })
  }

  presentableServer(server, member) {
    return this.cacheCurry(`ps:${server.id}-${member.user.id}`, async () => {
      let message = ''
      let categories = []

      try {
        const serverData = await this.ctx.server.get(server.id)
        message = serverData.message
        categories = serverData.categories
      } catch (e) {}

      const serverRoles = await this.discord.getRoles(server.id)
      const memberRoles = member.rolesList
        .map((id) => serverRoles.find((role) => role.id === id))
        .sort((a, b) => (a.position > b.position ? -1 : 1))

      const color = memberRoles.length > 0 ? memberRoles[0].color : 0

      return {
        id: server.id,
        gm: {
          ...member,
          color,
        },
        roles: serverRoles,
        perms: this.discord.getPermissions(member, serverRoles, server),
        server,
        message,
        categories,
      }
    })
  }

  async cacheCurry(key, func) {
    if (process.env.DISABLE_CACHE === 'true') {
      return func()
    }

    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    const returnVal = await func()

    this.cache.set(key, returnVal)

    return returnVal
  }

  invalidate(deadKey) {
    const keys = this.cache.keys()
    for (let key of keys) {
      if (key.includes(deadKey)) {
        this.cache.del(key)
      }
    }
  }
}

module.exports = PresentationService
