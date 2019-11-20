module.exports = (R, $) => {
  R.get('/api/~/relevant-servers/:user', (ctx, next) => {
    // ctx.body = 'ok'
    const srv = $.discord.getRelevantServers(ctx.params.user)
    ctx.body = $.discord.presentableServers(srv, ctx.params.user)
    return
  })

  R.get('/api/~/roles/:id/:userId', (ctx, next) => {
    // ctx.body = 'ok'
    const { id, userId } = ctx.params

    const srv = $.discord.client.guilds.get(id)

    if (srv === undefined) {
      ctx.body = { err: 'not found' }
      ctx.status = 404
      return
    }

    const gm = srv.members.get(userId)
    const roles = $.discord.presentableRoles(id, gm)

    ctx.boy = roles
  })
}
