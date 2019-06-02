// import { Context } from 'koa'
import { AppContext, Router, KoaContextExt } from '../Roleypoly'
import ksuid from 'ksuid'
import logger from '../logger'
import renderError from '../util/error'
const log = logger(__filename)

export default (R: Router, $: AppContext) => {
  R.post('/api/auth/token', async (ctx: KoaContextExt) => {
    const { token } = ctx.request.body as { token: string | undefined }

    if (token === undefined || token === '') {
      ctx.body = { err: 'token_missing' }
      ctx.status = 400
      return
    }

    console.log(ctx.session.expiresAt >= new Date(), ctx.session.expiresAt, new Date())

    if (ctx.session.accessToken === undefined || ctx.session.expiresAt >= new Date()) {
      const data = await $.discord.initializeOAuth(token)
      ctx.session.accessToken = data.access_token
      ctx.session.refreshToken = data.refresh_token
      ctx.session.expiresAt = new Date() + ctx.expires_in
    }

    const user = await $.discord.getUserFromToken(ctx.session.accessToken)
    ctx.session.userId = user.id
    ctx.session.avatarHash = user.avatar

    ctx.body = {
      id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator
    }
  })

  R.get('/api/auth/user', async (ctx: KoaContextExt) => {
    const { accessToken } = ctx.session as { accessToken?: string }
    if (accessToken === undefined) {
      ctx.body = { err: 'not_logged_in' }
      ctx.status = 401
      return
    }

    const user = await $.discord.getUserFromToken(accessToken)
    ctx.session.userId = user.id
    ctx.session.avatarHash = user.avatar

    ctx.body = {
      id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator
    }
  })

  R.get('/api/auth/redirect', async (ctx: KoaContextExt) => {
    const { r } = ctx.query
    // check if already authed
    if (await $.auth.isLoggedIn(ctx, { refresh: true })) {
      log.debug('already authed.', ctx.session)
      return ctx.redirect(r || '/')
    }

    ctx.session.oauthRedirect = r
    const url = $.discord.getAuthUrl(ksuid.randomSync().string)
    if (ctx.query.url === '✔️') {
      ctx.body = { url }
      return
    }

    ctx.redirect(url)
  })

  R.get('/api/oauth/callback', async (ctx: KoaContextExt, next: *) => {
    const { code, state } = ctx.query
    const { oauthRedirect: r } = ctx.session
    delete ctx.session.oauthRedirect
    if (await $.auth.isLoggedIn(ctx)) {
      log.debug('user was logged in')
      return ctx.redirect(r || '/')
    }

    if (code == null) {
      ctx.status = 400
      await renderError($, ctx)
      return
    }

    if (state != null) {
      try {
        const ksState = ksuid.parse(state)
        const fiveMinAgo = Date.now() - 1000 * 60 * 5
        if (+ksState.date < fiveMinAgo) {
          ctx.status = 419
          await renderError($, ctx)
          return
        }
      } catch (e) {
        ctx.status = 400
        await renderError($, ctx)
        return
      }
    }

    try {
      const tokens = await $.discord.initializeOAuth(code)
      const user = await $.discord.getUserFromToken(tokens.access_token)
      $.auth.injectSessionFromOAuth(ctx, tokens, user.id)
      log.debug('user logged in', { tokens, user, s: ctx.session })
      return ctx.redirect(r || '/')
    } catch (e) {
      log.error('token and auth fetch failure', e)
      ctx.status = 400
      return renderError($, ctx)
    }
  })

  R.post('/api/auth/logout', async (ctx: KoaContextExt) => {
    ctx.session = {}
  })

  R.get('/api/auth/logout', async (ctx: KoaContextExt) => {
    if (await $.auth.isLoggedIn(ctx)) {
      if (ctx.session.authType === 'oauth') {
        await $.discord.revokeOAuth(ctx.session )
      }
    }

    ctx.session = {}
    return ctx.redirect('/')
  })

  R.get('/api/oauth/bot', async (ctx: KoaContextExt) => {
    const url = $.discord.getBotJoinUrl()
    if (ctx.query.url === '✔️') {
      ctx.body = { url }
      return
    }

    ctx.redirect(url)
  })

  R.get('/api/oauth/bot/callback', async (ctx: KoaContextExt) => {
    // console.log(ctx.request)
  })

  R.get('/magic/:challenge', async (ctx: KoaContextExt) => {
    if (ctx.request.headers['user-agent'].includes('Discordbot')) {
      return $.ui.render(ctx.req, ctx.res, '/_internal/_discordbot/_magic', {})
    }

    const { challenge } = ((ctx.params: any): { challenge: string })
    const chall = await $.auth.fetchDMChallenge({ magic: challenge })
    // log.notice('magic user agent', { ua: ctx.request.headers['User-Agent'] })

    if (chall == null) {
      log.warn('bad magic', challenge)
      return ctx.redirect('/auth/expired')
    }

    $.auth.injectSessionFromChallenge(ctx, chall)
    await $.auth.deleteDMChallenge(chall)
    log.info('logged in via magic', chall)

    return ctx.redirect('/')
  })
}
