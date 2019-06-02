// @flow
import Service from './Service'
import LRU from 'lru-cache'
import { AppContext } from '../Roleypoly'
import { Models } from '../models'
import { ServerModel } from '../models/Server'
import DiscordService from './discord'
// $FlowFixMe
import { Sequence } from 'immutable'
import {
  Guild,
  Collection
} from 'eris'
import {
  Member,
  PresentableServer,
  ServerSlug,
  PresentableRole
} from '@roleypoly/types'
import areduce from '../util/areduce'

export default class PresentationService extends Service {
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
    return areduce<Guild, PresentableServer>(Array.from(collection.values()), async (acc: PresentableServer[], server: Guild) => {
      const gm = server.members.get(userId)
      if (gm == null) {
        throw new Error(`somehow this guildmember ${userId} of ${server.id} didn't exist.`)
      }

      acc.push(await this.presentableServer(server, gm, { incRoles: false }))
      return acc
    })
  }

  async presentableServer (server: Guild, gm: Member, { incRoles = true }: { incRoles?: boolean } = {}): Promise<PresentableServer> {
    const sd = await this.ctx.server.get(server.id)

    return {
      id: server.id,
      gm: {
        nickname: gm.nick || gm.user.username,
        color: gm.color || null,
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
