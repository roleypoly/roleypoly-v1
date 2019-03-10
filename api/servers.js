// @flow
import { type Context } from 'koa'
import { type AppContext, type Router } from '../Roleypoly'
import { type ServerModel } from '../models/Server'

export default (R: Router, $: AppContext) => {
  R.get('/api/servers', async (ctx: Context) => {
    try {
      const { userId } = ctx.session
      const srv = $.discord.getRelevantServers(userId)
      const presentable = await $.P.presentableServers(srv, userId)

      ctx.body = presentable
    } catch (e) {
      console.error(e.trace || e.stack)
    }
  })

  R.get('/api/server/:id', async (ctx: Context) => {
    const { userId } = ctx.session
    const { id } = ctx.params

    const srv = $.discord.client.guilds.get(id)

    if (srv == null) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    let gm
    if (srv.members.has(userId)) {
      gm = $.discord.gm(id, userId)
    } else if ($.discord.isRoot(userId)) {
      gm = $.discord.fakeGm({ id: userId })
    }

    if (gm == null) {
      ctx.body = { err: 'not_a_member' }
      ctx.status = 400
      return
    }

    const server = await $.P.presentableServer(srv, gm)

    // $FlowFixMe bad koa type
    ctx.body = server
  })

  R.get('/api/server/:id/slug', async (ctx: Context) => {
    // const { userId } = ctx.session
    const { id } = ctx.params

    const srv = $.discord.client.guilds.get(id)

    console.log(srv)

    if (srv == null) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    // $FlowFixMe bad koa type
    ctx.body = await $.P.serverSlug(srv)
  })

  R.patch('/api/server/:id', async (ctx: Context) => {
    const { userId } = (ctx.session: { userId: string })
    const { id } = (ctx.params: { id: string })

    let gm = $.discord.gm(id, userId)
    if (gm == null) {
      if ($.discord.isRoot(userId)) {
        gm = $.discord.fakeGm({ id: userId })
      } else {
        ctx.status = 403
        ctx.body = {
          err: 'not permitted'
        }
        return
      }
    }

    // check perms
    if (!$.discord.getPermissions(gm).canManageRoles) {
      ctx.status = 403
      ctx.body = { err: 'cannot_manage_roles' }
      return
    }

    const { message, categories } = ((ctx.request.body: any): $Shape<ServerModel>)

    // todo make less nasty
    await $.server.update(id, {
      ...((message != null) ? { message } : {}),
      ...((categories != null) ? { categories } : {})
    })

    ctx.body = { ok: true }
  })

  R.get('/api/admin/servers', async (ctx: Context) => {
    const { userId } = (ctx.session: { userId: string })
    if (!$.discord.isRoot(userId)) {
      return
    }

    ctx.body = $.discord.client.guilds.map(g => ({ url: `${$.config.appUrl}/s/${g.id}`, name: g.name, members: g.members.array().length, roles: g.roles.array().length }))
  })

  R.patch('/api/servers/:server/roles', async (ctx: Context) => {
    const { userId } = (ctx.session: { userId: string })
    const { server } = (ctx.params: { server: string })

    let gm = $.discord.gm(server, userId)
    if (gm == null) {
      if ($.discord.isRoot(userId)) {
        gm = $.discord.fakeGm({ id: userId })
      } else {
        ctx.status = 403
        ctx.body = {
          err: 'not permitted'
        }
        return
      }
    }

    const { added, removed } = ((ctx.request.body: any): { added: string[], removed: string[] })

    const allowedRoles = await $.server.getAllowedRoles(server)

    const pred = r => $.discord.safeRole(server, r) && allowedRoles.indexOf(r) !== -1

    if (added.length > 0) {
      gm = await gm.addRoles(added.filter(pred))
    }

    setTimeout(() => {
      if (gm == null) {
        ctx.body = {
          err: 'guild member disappeared on remove, this should never happen.'
        }
        ctx.status = 500

        return
      }

      if (removed.length > 0) {
        gm.removeRoles(removed.filter(pred))
      }
    }, 1000)

    ctx.body = { ok: true }
  })
}
