module.exports = (R, $) => {
  R.get('/api/~/relevant-servers/:user', (ctx, next) => {
    // ctx.body = 'ok'
    const srv = $.discord.getRelevantServers(ctx.params.user)
    ctx.body = $.discord.presentableServers(srv, ctx.params.user)
    return
  })

  R.get('/api/~/roles/:server', (ctx, next) => {
    // ctx.body = 'ok'
    ctx.body = $.discord.getRoles(ctx.params.server)
    return
  })
}
