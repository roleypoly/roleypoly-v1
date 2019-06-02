import Service from './Service'
import nanoid from 'nanoid'
import moniker from 'moniker'
import { AppContext } from '../Roleypoly'
import { Context } from 'koa'
import Sequelize from 'sequelize'
// import type { UserPartial } from './discord'
// import type { Models } from '../models'

export type DMChallenge = {
  userId: string, // snowflake of the user
  human: string, // humanized string for input elsewhere, adjective adjective noun
  magic: string, // magic URL, a nanoid
  issuedAt: number // Date.now()
}

export type AuthTokens = {
  access_token: string,
  refresh_token: string,
  expires_in: string
}

type AuthModels = { AuthChallenge: Sequelize.ModelCtor<any>, Session: Sequelize.ModelCtor<any> }

export default class AuthService extends Service {
  M: AuthModels
  monikerGen = moniker.generator([ moniker.adjective, moniker.adjective, moniker.noun ], { glue: ' ' })
  constructor (ctx: AppContext) {
    super(ctx)
    this.M = ctx.M as AuthModels
  }

  async isLoggedIn (ctx: Context, { refresh }: { refresh: boolean } = { refresh: false }) {
    const { userId, expiresAt, authType } = ctx.session
    this.log.debug('isLoggedIn session', ctx.session)
    if (userId == null) {
      this.log.debug('isLoggedIn failed, no userId', ctx.session)
      return false
    }

    if (expiresAt < Date.now()) {
      this.log.debug('session has expired.', expiresAt, Date.now())
      if (refresh && authType === 'oauth') {
        this.log.debug('was oauth and we can refresh')
        const tokens = await this.ctx.discord.refreshOAuth(ctx.session)
        this.injectSessionFromOAuth(ctx, tokens, userId)
        return true
      }

      this.log.debug('was not oauth, we are destroying the session')
      ctx.session = null // reset session as well
      return false
    }

    this.log.debug('this user is logged in', userId)
    return true
  }

  async createDMChallenge (userId: string | undefined): Promise<DMChallenge> {
    if (userId === undefined || userId === '') {
      throw new Error('userId was not set')
    }

    if (await this.ctx.discord.isValidUser(userId) === false) {
      throw new Error('userId was not a valid user')
    }

    const out: DMChallenge = {
      userId,
      human: this.monikerGen.choose(),
      magic: nanoid(10),
      issuedAt: Date.now()
    }

    await this.M.AuthChallenge.build({ ...out, type: 'dm' }).save()
    this.log.debug('created DM auth challenge', out)
    return out
  }

  async fetchDMChallenge (input: { human: string } | { magic: string }): Promise<DMChallenge | null> {
    const challenge: DMChallenge | undefined = this.M.AuthChallenge.findOne({ where: input })
    if (challenge === undefined) {
      this.log.debug('challenge not found', challenge)
      return null
    }

    // if issued more than 1 hour ago, it doesn't matter.
    if (+challenge.issuedAt + 3.6e5 < Date.now()) {
      this.log.debug('challenge expired', challenge)
      return null
    }

    return challenge
  }

  deleteDMChallenge (input: DMChallenge) {
    return this.M.AuthChallenge.destroy({ where: { magic: input.magic } })
  }

  injectSessionFromChallenge (ctx: Context, chall: DMChallenge) {
    ctx.session = {
      ...ctx.session,
      userId: chall.userId,
      authType: 'dm',
      expiresAt: Date.now() + 1000 * 60 * 60 * 24
    }

    this.log.debug('new session', ctx.session)
  }

  injectSessionFromOAuth (ctx: Context, tokens: AuthTokens, userId: string) {
    const { expires_in: expiresIn, access_token: accessToken, refresh_token: refreshToken } = tokens
    ctx.session = {
      ...ctx.session,
      userId,
      authType: 'oauth',
      expiresAt: Date.now() + expiresIn,
      accessToken,
      refreshToken
    }
  }

  async clearUserSessions (userId: string) {
    // get all sessions but also revoke any oauth tokens.
    const sessions = await this.M.Session.findAll({ where: { data: { userId } } })

    for (let session of sessions) {
      if (session.data.authType === 'oauth') {
        await this.ctx.discord.revokeOAuth({ accessToken: session.data.accessToken })
      }

      await session.destroy()
    }
  }
}
