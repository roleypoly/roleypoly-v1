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

    const originalRoles = gm.roles
    let { added, removed } = ((ctx.request.body: any): { added: string[], removed: string[] })

    const allowedRoles: string[] = await $.server.getAllowedRoles(server)

    const isSafe = (r: string) => $.discord.safeRole(server, r) && allowedRoles.includes(r)

    added = added.filter(isSafe)
    removed = removed.filter(isSafe)

    const newRoles = originalRoles.concat(added).filter(x => !removed.includes(x))
    gm.edit({
      roles: newRoles
    })

    ctx.body = { ok: true }
  })
}
