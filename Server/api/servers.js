module.exports = (R, $) => {
  R.get('/api/servers', async ctx => {
    try {
      const { userId } = ctx.session
      const srv = $.discord.getRelevantServers(userId)
      const presentable = await $.P.presentableServers(srv, userId)

      ctx.body = presentable
    } catch (e) {
      console.error(e.trace || e.stack)
    }
  })

  R.get('/api/server/:id', async ctx => {
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
    } else {
      ctx.body = { err: 'not_a_member' }
      ctx.status = 400
      return
    }
    const server = await $.P.presentableServer(srv, gm)

    ctx.body = server
  })

  R.get('/api/server/:id/slug', async ctx => {
    const { id } = ctx.params

    const srv = $.discord.client.guilds.get(id)

    console.log(srv)

    if (srv == null) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    ctx.body = await $.P.serverSlug(srv)
  })

  R.patch('/api/server/:id', async ctx => {
    const { userId } = ctx.session
    const { id } = ctx.params

    let gm = $.discord.gm(id, userId)
    if (gm == null && $.discord.isRoot(userId)) {
      gm = $.discord.fakeGm({ id: userId })
    }

    // check perms
    if (!$.discord.getPermissions(gm).canManageRoles) {
      ctx.status = 403
      ctx.body = { err: 'cannot_manage_roles' }
      return
    }

    const { message = null, categories = null } = ctx.request.body

    // todo make less nasty
    await $.server.update(id, {
      ...(message != null ? { message } : {}),
      ...(categories != null ? { categories } : {}),
    })

    ctx.body = { ok: true }
  })

  R.get('/api/admin/servers', async ctx => {
    const { userId } = ctx.session
    if (!$.discord.isRoot(userId)) {
      return
    }

    ctx.body = $.discord.client.guilds.map(g => ({
      url: `${process.env.APP_URL}/s/${g.id}`,
      name: g.name,
      members: g.members.array().length,
      roles: g.roles.array().length,
    }))
  })

  R.patch('/api/servers/:server/roles', async ctx => {
    const { userId } = ctx.session
    const { server } = ctx.params

    let gm = $.discord.gm(server, userId)
    if (gm == null && $.discord.isRoot(userId)) {
      gm = $.discord.fakeGm({ id: userId })
    }

    // check perms
    // if (!$.discord.getPermissions(gm).canManageRoles) {
    //   ctx.status = 403
    //   ctx.body = { err: 'cannot_manage_roles' }
    //   return
    // }

    const { added, removed } = ctx.request.body

    const allowedRoles = await $.server.getAllowedRoles(server)

    const pred = r => $.discord.safeRole(server, r) && allowedRoles.indexOf(r) !== -1

    if (added.length > 0) {
      gm = await gm.addRoles(added.filter(pred))
    }

    setTimeout(() => {
      if (removed.length > 0) {
        gm.removeRoles(removed.filter(pred))
      }
    }, 1000)

    // console.log('role patch', { added, removed, allowedRoles, addedFiltered: added.filterNot(pred), removedFiltered: removed.filterNot(pred) })

    ctx.body = { ok: true }
  })
}
