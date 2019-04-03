// @flow
import type { IFetcher } from './types'
import type DiscordSvc from '../discord'
import type ErisClient, { User, Member, Guild } from 'eris'
import LRU from 'lru-cache'
import logger from '../../logger'
const log = logger(__filename)

export default class BotFetcher implements IFetcher {
  ctx: DiscordSvc
  client: ErisClient
  cache: LRU<string, Guild | Member | User>

  constructor (ctx: DiscordSvc) {
    this.ctx = ctx
    this.client = ctx.client
    this.cache = new LRU({
      max: 50,
      maxAge: 1000 * 60 * 10
    })
  }

  getUser = async (id: string): Promise<?User> => {
    if (this.cache.has(`U:${id}`)) {
      log.debug('user cache hit')
      return this.cache.get(`U:${id}`)
    }

    log.debug('user cache miss')

    try {
      const u = await this.client.getRESTUser(id)
      this.cache.set(`U:${id}`, u)
      return u
    } catch (e) {
      return null
    }
  }
  getMember = async (server: string, user: string): Promise<?Member> => {
    if (this.cache.has(`M:${server}:${user}`)) {
      log.debug('member cache hit')
      return this.cache.get(`M:${server}:${user}`)
    }

    log.debug('member cache miss')

    try {
      const m = await this.client.getRESTGuildMember(server, user)
      this.cache.set(`M:${server}:${user}`, m)
      // $FlowFixMe
      m.guild = await this.getGuild(server) // we have to prefill this for whatever reason
      return m
    } catch (e) {
      return null
    }
  }

  getGuild = async (server: string): Promise<?Guild> => {
    if (this.cache.has(`G:${server}`)) {
      log.debug('guild cache hit')
      return this.cache.get(`G:${server}`)
    }

    log.debug('guild cache miss')

    try {
      const g = await this.client.getRESTGuild(server)
      this.cache.set(`G:${server}`, g)
      return g
    } catch (e) {
      return null
    }
  }
}
