// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
import { type Guild } from 'eris'
import { root } from './_security'

export default ($: AppContext) => ({

  rootGetAllServers: root($, (ctx: Context) => {
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

  getServer (ctx: Context, id: string) {
    const { userId } = (ctx.session: { userId: string })

    const srv = $.discord.client.guilds.get(id)
    if (srv == null) {
      return { err: 'not_found' }
    }

    if (userId == null) {
      return {
        id: id,
        server: $.P.serverSlug(srv)
      }
    }

    let gm
    if (srv.members.has(userId)) {
      gm = $.discord.gm(id, userId)
    } else if ($.discord.isRoot(userId)) {
      gm = $.discord.fakeGm({ id: userId })
    }

    if (gm == null) {
      return { err: 'not_found' }
    }

    return $.P.presentableServer(srv, gm)
  }
})
