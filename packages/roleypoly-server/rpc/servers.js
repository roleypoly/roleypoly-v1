// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
import { type Guild } from 'eris'
import * as secureAs from './_security'
import RPCError from './_error'

export default ($: AppContext) => ({

  rootGetAllServers: secureAs.root($, (ctx: Context) => {
    return $.discord.client.guilds.map<{
      url: string,
      name: string,
      members: number,
      roles: number
    }>((g: Guild) => ({ url: `${$.config.appUrl}/s/${g.id}`, name: g.name, members: g.memberCount, roles: g.roles.size }))
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
  })
})
