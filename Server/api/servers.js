const ksuid = require('ksuid')
const log = new (require('../logger'))('api/servers')


module.exports = (R, $) => {
  const getGm = async (id, userId) => {
    let gm

    try {
      gm = await $.discord.gm(id, userId)
    } catch (e) {
      if ($.discord.isRoot(userId)) {
        gm = $.discord.fakeGm({ id: userId })
      }
    }

    return gm
  }

  R.get('/api/servers', async (ctx, next) => {
    const { userId } = ctx.session
    const presentable = await $.P.presentableServers(userId)

    ctx.status = 200
    ctx.body = presentable
    await next()
  })

  R.get('/api/server/:id', async ctx => {
    const { userId } = ctx.session
    const { id } = ctx.params

    const srv = await $.discord.getServer(id)

    if (srv == null) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    const gm = await getGm(id, userId)
    if (!gm) {
      ctx.body = { err: 'not_a_member' }
      ctx.status = 400
      return
    }

    try {
      const server = await $.P.presentableServer(srv, gm)
      ctx.body = server
    } catch (e) {
      const txid = await ksuid.random()
      log.error(`presentable render failed -- txid: ${txid}`, id, userId, gm, e)
      ctx.status = 500
      ctx.body = { err: 'render_failed', txid }
    }

  })

  R.get('/api/server/:id/slug', async ctx => {
    const { id } = ctx.params

    const srv = await $.discord.getServer(id)

    if (srv == null) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    ctx.body = srv
  })

  R.patch('/api/server/:id', async ctx => {
    const { userId } = ctx.session
    const { id } = ctx.params

    const gm = await getGm(id, userId)
    if (!gm) {
      ctx.body = { err: 'not_a_member' }
      ctx.status = 400
      return
    }

    const guild = await $.discord.getServer(id)
    const guildRoles = await $.discord.getRoles(id)

    // check perms
    if (!$.discord.getPermissions(gm, guildRoles, guild).canManageRoles) {
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
    const { added, removed } = ctx.request.body

    let gm = await getGm(server, userId)
    if (!gm) {
      ctx.status = 404
      return
    }

    const currentRoles = gm.rolesList
    const allowedRoles = await $.server.getAllowedRoles(server)

    // current roles and allowed roles are an inclusive set.
    // first, filter added and removed.
    const sanitizedAdded = added.filter(role => allowedRoles.includes(role))
    const sanitizedRemoved = removed.filter(role => allowedRoles.includes(role))

    // filter currentRoles by what's been removed (down is faster than up)
    let newRoles = currentRoles.filter(role => !sanitizedRemoved.includes(role))

    // last, add new roles
    newRoles = [...newRoles, ...sanitizedAdded]

    await $.discord.updateRoles(gm, newRoles)

    ctx.body = { ok: true }
  })
}
