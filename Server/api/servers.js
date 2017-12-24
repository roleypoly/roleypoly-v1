module.exports = (R, $) => {
  R.get('/api/servers', async (ctx) => {
    try {
      const { userId } = ctx.session
      const srv = $.discord.getRelevantServers(userId)
      const presentable = await $.P.oldPresentableServers(srv, userId)

      ctx.body = presentable
    } catch (e) {
      console.error(e.trace)
    }
  })

  R.get('/api/server/:id', async (ctx) => {
    const { userId } = ctx.session
    const { id } = ctx.params

    const srv = $.discord.client.guilds.get(id)

    if (srv == null) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    const gm = srv.members.get(userId)
    const server = $.discord.presentableRoles(id, gm)

    ctx.body = server
  })

  R.patch('/api/servers/:server/roles', async ctx => {
    const { userId } = ctx.session
    const { server } = ctx.params
    let gm = $.discord.gm(server, userId)

    const { added, removed } = ctx.request.body

    if (added.length > 0) {
      gm = await gm.addRoles(added.filter(r => $.discord.safeRole(server, r)))
    }

    if (removed.length > 0) {
      gm = await gm.removeRoles(removed.filter(r => $.discord.safeRole(server, r)))
    }

    ctx.body = { ok: true }
  })
}
