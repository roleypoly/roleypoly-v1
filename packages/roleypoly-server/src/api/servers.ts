import { Context } from 'koa'
import { AppContext, Router, KoaContextExt } from '../Roleypoly'
import { ServerModel } from '../models/Server'
import { MemberExt } from '../services/discord'
import { Member } from 'eris'

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

    if (srv === undefined) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    let gm: Partial<MemberExt> | undefined
    if (srv.members.has(userId)) {
      gm = await $.discord.gm(id, userId)
    } else if ($.discord.isRoot(userId)) {
      gm = $.discord.fakeGm({ id: userId })
    }

    if (gm === undefined) {
      ctx.body = { err: 'not_a_member' }
      ctx.status = 400
      return
    }

    const server = await $.P.presentableServer(srv, gm as Member)

    ctx.body = server
  })

  R.get('/api/server/:id/slug', async (ctx: Context) => {
    // const { userId } = ctx.session
    const { id } = ctx.params

    const srv = $.discord.client.guilds.get(id)

    console.log(srv)

    if (srv === undefined) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    ctx.body = $.P.serverSlug(srv)
  })

  R.patch('/api/server/:id', async (ctx: KoaContextExt) => {
    const { userId } = (ctx.session as { userId: string })
    const { id } = (ctx.params as { id: string })

    let gm = await $.discord.gm(id, userId)

    if (gm === undefined) {
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
    if (!$.discord.getPermissions(gm as Member).canManageRoles) {
      ctx.status = 403
      ctx.body = { err: 'cannot_manage_roles' }
      return
    }

    const { message, categories } = ctx.request.body as Partial<ServerModel>

    // todo make less nasty
    await $.server.update(id, {
      ...((message !== undefined) ? { message } : {}),
      ...((categories !== undefined) ? { categories } : {})
    })

    ctx.body = { ok: true }
  })

  R.patch('/api/servers/:server/roles', async (ctx: KoaContextExt) => {
    const { userId } = (ctx.session as { userId: string })
    const { server } = (ctx.params as { server: string })

    let gm = await $.discord.gm(server, userId)

    if (gm === undefined) {
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

    const originalRoles = gm.roles || []
    let { added, removed } = ctx.request.body as { added: string[], removed: string[] }

    const allowedRoles: string[] = await $.server.getAllowedRoles(server)

    const isSafe = (r: string) => $.discord.safeRole(server, r) && allowedRoles.includes(r)

    added = added.filter(isSafe)
    removed = removed.filter(isSafe)

    const newRoles = originalRoles.concat(added).filter(x => !removed.includes(x))

    // force cast this because we know this will be correct.
    await (gm as Member).edit({
      roles: newRoles
    })

    ctx.body = { ok: true }
  })
}
