module.exports = (R, $) => {
  R.post('/api/auth/token', async (ctx) => {
    const { token } = ctx.request.body

    if (token == null || token === '') {
      ctx.body = { err: 'token_missing' }
      ctx.status = 400
      return
    }

    if (ctx.session.accessToken === undefined || ctx.session.expiresAt < Date.now()) {
      const data = await $.discord.getAuthToken(token)
      ctx.session.accessToken = data.access_token
      ctx.session.refreshToken = data.refresh_token
      ctx.session.expiresAt = Date.now() + (ctx.expires_in || 1000 * 60 * 60 * 24)
    }

    const user = await $.discord.getUser(ctx.session.accessToken)
    ctx.session.userId = user.id
    ctx.session.avatarHash = user.avatar

    ctx.body = {
      id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator,
    }
  })

  R.get('/api/auth/user', async (ctx) => {
    if (ctx.session.accessToken === undefined) {
      ctx.body = { err: 'not_logged_in' }
      ctx.status = 401
      return
    }

    const user = await $.discord.getUser(ctx.session.accessToken)
    ctx.session.userId = user.id
    ctx.session.avatarHash = user.avatar

    ctx.body = {
      id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator,
    }
  })

  R.get('/api/auth/redirect', (ctx) => {
    const url = $.discord.getAuthUrl()
    if (ctx.query.url === '✔️') {
      ctx.body = { url }
      return
    }

    ctx.redirect(url)
  })

  R.post('/api/auth/logout', (ctx) => {
    ctx.session = null
  })

  R.get('/api/oauth/bot', (ctx) => {
    const url = $.discord.getBotJoinUrl()
    if (ctx.query.url === '✔️') {
      ctx.body = { url }
      return
    }

    ctx.redirect(url)
  })

  R.get('/api/oauth/bot/callback', (ctx) => {})
}
