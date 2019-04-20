// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
import { type Guild } from 'eris'
import { secureAs } from '@roleypoly/rpc-server'
import { RPCError } from '@roleypoly/rpc-client'

export default ($: AppContext) => ({

  rootGetAllServers: secureAs.root($, (ctx: Context) => {
    return $.discord.guilds.valueSeq().map<{
      url: string,
      name: string,
      members: number,
      roles: number
    }>((g: Guild) => ({ url: `${$.config.appUrl}/s/${g.id}`, name: g.name, members: g.members.size, roles: g.roles.size })).toJS()
  }),

  getServerSlug (ctx: Context, id: string) {
    const srv = $.discord.client.guilds.get(id)
    if (srv == null) {
      return null
    }

    return $.P.serverSlug(srv)
  },

  getServer: secureAs.member($, async (ctx: Context, id: string) => {
    const { userId } = (ctx.session: { userId: string })

    const srv = await $.discord.fetcher.getGuild(id)
    if (srv == null) {
      throw new RPCError('server not found', 404)
    }

    let gm = await $.discord.gm(id, userId, { canFake: true })

    if (gm == null) {
      throw new RPCError('server not found', 404)
    }

    return $.P.presentableServer(srv, gm)
  }),

  listOwnServers: secureAs.authed($, async (ctx: Context, id: string) => {
    const { userId } = (ctx.session: { userId: string })
    const srv = $.discord.getRelevantServers(userId)
    return $.P.presentableServers(srv, userId)
  }),

  syncGuild: secureAs.bot($, async (ctx: Context, type: string, guildId: string) => {
    const g = await $.discord.guild(guildId, true)
    if (g != null && type === 'guildCreate') {
      $.server.ensure(g)
    }
  })
})
