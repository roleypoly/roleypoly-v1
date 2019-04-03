// @flow
import Service from './Service'
import nanoid from 'nanoid'
import moniker from 'moniker'
import type { AppContext } from '../Roleypoly'
import type { Context } from 'koa'
// import type { UserPartial } from './discord'
// import type { Models } from '../models'

export type DMChallenge = {
  userId: string, // snowflake of the user
  human: string, // humanized string for input elsewhere, adjective adjective noun
  magic: string, // magic URL, a nanoid
  issuedAt: Date
}

export type AuthTokens = {
  access_token: string,
  refresh_token: string,
  expires_in: string
}

export default class AuthService extends Service {
  M: { AuthChallenge: any }
  monikerGen = moniker.generator([ moniker.adjective, moniker.adjective, moniker.noun ], { glue: ' ' })
  constructor (ctx: AppContext) {
    super(ctx)
    this.M = ctx.M
  }

  async isLoggedIn (ctx: Context, { refresh = false }: { refresh: boolean } = {}) {
    const { userId, expiresAt, authType } = ctx.session
    if (userId == null) {
      return false
    }

    if (expiresAt < Date.now()) {
      if (refresh && authType === 'oauth') {
        const tokens = await this.ctx.discord.refreshOAuth(ctx.session)
        this.injectSessionFromOAuth(ctx, tokens, userId)
        return true
      }

      ctx.session = null // reset session as well
      return false
    }

    return true
  }

  async createDMChallenge (userId: string): Promise<DMChallenge> {
    const out: DMChallenge = {
      userId,
      human: this.monikerGen.choose(),
      magic: nanoid(10),
      issuedAt: new Date()
    }

    await this.M.AuthChallenge.build({ ...out, type: 'dm' }).save()
    this.log.debug('created DM auth challenge', out)
    return out
  }

  async fetchDMChallenge (input: { human: string } | { magic: string }): Promise<?DMChallenge> {
    const challenge: ?DMChallenge = this.M.AuthChallenge.findOne({ where: input })
    if (challenge == null) {
      this.log.debug('challenge not found', challenge)
      return null
    }

    // if issued more than 1 hour ago, it doesn't matter.
    if (+challenge.issuedAt + 3.6e5 < new Date()) {
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
      userId: chall.userId,
      authType: 'dm',
      expiresAt: Date.now() + 1000 * 60 * 60 * 24
    }
  }

  injectSessionFromOAuth (ctx: Context, tokens: AuthTokens, userId: string) {
    const { expires_in: expiresIn, access_token: accessToken, refresh_token: refreshToken } = tokens
    ctx.session = {
      userId,
      authType: 'oauth',
      expiresAt: Date.now() + expiresIn,
      accessToken,
      refreshToken
    }
  }
}
