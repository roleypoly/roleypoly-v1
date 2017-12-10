module.exports = (R, $) => {
  R.post('/api/auth/token', async (ctx) => {
    const { token } = ctx.request.body

    if (token == null || token === '') {
      ctx.body = { err: 'token_missing' }
      ctx.status = 400
      return
    }

    console.log(ctx.session.expiresAt >= new Date(), ctx.session.expiresAt, new Date())

    if (ctx.session.accessToken === undefined || ctx.session.expiresAt >= new Date()) {
      console.log('getting auth token')
      const data = await $.discord.getAuthToken(token)
      console.log(data)
      ctx.session.accessToken = data.access_token
      ctx.session.refreshToken = data.refresh_token
      ctx.session.expiresAt = new Date() + ctx.expires_in
      console.log(ctx.session)
    }

    const user = await $.discord.getUser(ctx.session.accessToken)
    ctx.session.userId = user.id
    ctx.session.avatarHash = user.avatar

    ctx.body = {
      id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator
    }
  })

  R.get('/api/auth/user', async ctx => {
    const user = await $.discord.getUser(ctx.session.accessToken)
    ctx.session.userId = user.id
    ctx.session.avatarHash = user.avatar

    ctx.body = {
      id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator
    }
  })

  R.get('/api/auth/redirect', ctx => {
    ctx.redirect($.discord.getAuthUrl())
  })
}
