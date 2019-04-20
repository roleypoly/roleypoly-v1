// @flow
import Service from './Service'
import LRU from 'lru-cache'
import { type AppContext } from '../Roleypoly'
import { type Models } from '../models'
import { type ServerModel } from '../models/Server'
import type DiscordService from './discord'
// $FlowFixMe
import type { Sequence } from 'immutable'
import {
  type Guild,
  type Collection
} from 'eris'
import type {
  Member,
  PresentableServer,
  ServerSlug,
  PresentableRole
} from '@roleypoly/types'
import areduce from '../util/areduce'
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

  presentableServers (collection: Collection<Guild> | Sequence<Guild>, userId: string): Promise<PresentableServer[]> {
    return areduce(Array.from(collection.values()), async (acc, server) => {
      const gm = server.members.get(userId)
      if (gm == null) {
        throw new Error(`somehow this guildmember ${userId} of ${server.id} didn't exist.`)
      }

      acc.push(await this.presentableServer(server, gm, { incRoles: false }))
      return acc
    }, [])
  }

  async presentableServer (server: Guild, gm: Member, { incRoles = true }: { incRoles: boolean } = {}): Promise<PresentableServer> {
    const sd = await this.ctx.server.get(server.id)

    return {
      id: server.id,
      gm: {
        nickname: gm.nick || gm.user.username,
        color: gm?.color,
        roles: gm.roles
      },
      server: this.serverSlug(server),
      roles: (incRoles) ? (await this.rolesByServer(server, sd)).map(r => ({ ...r, selected: gm.roles.includes(r.id) })) : [],
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
