// @flow
import Service from './Service'
import LRU from 'lru-cache'
import { type AppContext } from '../Roleypoly'
import { type Models } from '../models'
import { type ServerModel } from '../models/Server'
import type DiscordService, { Permissions } from './discord'
import {
  type Guild,
  type GuildMember,
  type Collection
} from 'discord.js'
import areduce from '../util/areduce'

export type ServerSlug = {
  id: string,
  name: string,
  ownerID: string,
  icon: string
}

export type PresentableRole = {
  id: string,
  color: number,
  name: string,
  position: number,
  safe: boolean
}

export type PresentableServer = ServerModel & {
  id: string,
  gm: {
    nickname: string,
    color: string
  },
  server: ServerSlug,
  roles: ?PresentableRole[],
  perms: Permissions
}

class PresentationService extends Service {
  cache: LRU
  M: Models
  discord: DiscordService

  constructor (ctx: AppContext) {
    super(ctx)
    this.M = ctx.M
    this.discord = ctx.discord

    this.cache = new LRU({ max: 500, maxAge: 100 * 60 * 5 })
  }

  serverSlug (server: Guild): ServerSlug {
    return {
      id: server.id,
      name: server.name,
      ownerID: server.ownerID,
      icon: server.icon
    }
  }

  async oldPresentableServers (collection: Collection<string, Guild>, userId: string) {
    this.log.deprecated('use presentableServers instead of oldPresentableServers')

    let servers = []

    for (let server of collection.array()) {
      const gm = server.members.get(userId)

      // $FlowFixMe this is deprecated, forget adding more check code.
      servers.push(await this.presentableServer(server, gm))
    }

    return servers
  }

  presentableServers (collection: Collection<string, Guild>, userId: string) {
    return areduce(collection.array(), async (acc, server) => {
      const gm = server.members.get(userId)
      if (gm == null) {
        throw new Error(`somehow this guildmember ${userId} of ${server.id} didn't exist.`)
      }

      acc.push(await this.presentableServer(server, gm, { incRoles: false }))
      return acc
    }, [])
  }

  async presentableServer (server: Guild, gm: GuildMember, { incRoles = true }: { incRoles: boolean } = {}): Promise<PresentableServer> {
    const sd = await this.ctx.server.get(server.id)

    return {
      id: server.id,
      gm: {
        nickname: gm.nickname,
        color: gm.displayHexColor
      },
      server: this.serverSlug(server),
      roles: (incRoles) ? (await this.rolesByServer(server, sd)).map(r => ({ ...r, selected: gm.roles.has(r.id) })) : [],
      message: sd.message,
      categories: sd.categories,
      perms: this.discord.getPermissions(gm)
    }
  }

  async rolesByServer (server: Guild, sd: ServerModel): Promise<PresentableRole[]> {
    return server.roles
      .filter(r => r.id !== server.id) // get rid of @everyone
      .map(r => ({
        id: r.id,
        color: r.color,
        name: r.name,
        position: r.position,
        safe: this.discord.safeRole(server.id, r.id)
      }))
  }
}

module.exports = PresentationService
