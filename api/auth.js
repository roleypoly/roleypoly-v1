// @flow
import { type Context } from 'koa'
import { type AppContext, type Router } from '../Roleypoly'
import ksuid from 'ksuid'
import logger from '../logger'
const log = logger(__filename)

export default (R: Router, $: AppContext) => {
  R.post('/api/auth/token', async (ctx: Context) => {
    const { token } = ((ctx.request.body: any): { token: string })

    if (token == null || token === '') {
      ctx.body = { err: 'token_missing' }
      ctx.status = 400
      return
    }

    console.log(ctx.session.expiresAt >= new Date(), ctx.session.expiresAt, new Date())

    if (ctx.session.accessToken === undefined || ctx.session.expiresAt >= new Date()) {
      const data = await $.discord.getAuthToken(token)
      ctx.session.accessToken = data.access_token
      ctx.session.refreshToken = data.refresh_token
      ctx.session.expiresAt = new Date() + ctx.expires_in
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

  R.get('/api/auth/user', async (ctx: Context) => {
    const { accessToken } = ((ctx.session: any): { accessToken?: string })
    if (accessToken === undefined) {
      ctx.body = { err: 'not_logged_in' }
      ctx.status = 401
      return
    }

    const user = await $.discord.getUser(accessToken)
    ctx.session.userId = user.id
    ctx.session.avatarHash = user.avatar

    ctx.body = {
      id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator
    }
  })

  R.get('/api/auth/redirect', async (ctx: Context) => {
    const url = $.discord.getAuthUrl(ksuid.randomSync().string)
    if (ctx.query.url === '✔️') {
      ctx.body = { url }
      return
    }

    ctx.redirect(url)
  })

  R.post('/api/auth/logout', async (ctx: Context) => {
    ctx.session = null
  })

  R.get('/api/oauth/bot', async (ctx: Context) => {
    const url = $.discord.getBotJoinUrl()
    if (ctx.query.url === '✔️') {
      ctx.body = { url }
      return
    }

    ctx.redirect(url)
  })

  R.get('/api/oauth/bot/callback', async (ctx: Context) => {
    // console.log(ctx.request)
  })

  R.get('/magic/:challenge', async (ctx: Context) => {
    const { challenge } = ((ctx.params: any): { challenge: string })
    const chall = await $.auth.fetchDMChallenge({ magic: challenge })
    if (chall == null) {
      log.warn('bad magic', challenge)
      ctx.status = 404
      return
    }

    ctx.session = {
      userId: chall.userId,
      authType: 'dm',
      expiresAt: Date.now() + 1000 * 60 * 60 * 24
    }

    log.info('logged in via magic', chall)

    return ctx.redirect('/')
  })
}
