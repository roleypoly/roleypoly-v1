import { IFetcher } from './types'
import DiscordSvc from '../discord'
import { Client, User, Member, Guild } from 'eris'
import LRU from 'lru-cache'
import logger from '../../logger'
import { OrderedSet } from 'immutable'
const log = logger(__filename)

export default class BotFetcher implements IFetcher {
  ctx: DiscordSvc
  client: Client
  cache: LRU<string, Guild | Member | User>

  constructor (ctx: DiscordSvc) {
    this.ctx = ctx
    this.client = ctx.client
    this.cache = new LRU({
      max: 50,
      maxAge: 1000 * 60 * 10
    })
  }

  getUser = async (id: string): Promise<User | undefined> => {
    if (this.cache.has(`U:${id}`)) {
      log.debug('user cache hit')
      return this.cache.get(`U:${id}`) as User
    }

    log.debug('user cache miss')

    try {
      const u = await this.client.getRESTUser(id)
      this.cache.set(`U:${id}`, u)
      return u
    } catch (e) {
      return undefined
    }
  }
  getMember = async (server: string, user: string): Promise<Member | undefined> => {
    if (this.cache.has(`M:${server}:${user}`)) {
      // log.debug('member cache hit')
      return this.cache.get(`M:${server}:${user}`) as Member
    }

    // log.debug('member cache miss')

    try {
      const m = await this.client.getRESTGuildMember(server, user)
      this.cache.set(`M:${server}:${user}`, m)
      // $FlowFixMe
      m.guild = await this.getGuild(server) as Guild // we have to prefill this for whatever reason
      return m
    } catch (e) {
      return undefined
    }
  }

  getGuild = async (server: string): Promise<Guild | undefined> => {
    if (this.cache.has(`G:${server}`)) {
      log.debug('guild cache hit')
      return this.cache.get(`G:${server}`) as Guild
    }

    log.debug('guild cache miss')

    try {
      const g = await this.client.getRESTGuild(server)
      this.cache.set(`G:${server}`, g)
      return g
    } catch (e) {
      return undefined
    }
  }

  getGuilds = async (): Promise<Guild[]> => {
    const last: string | undefined = undefined
    const limit: number = 100
    let out = OrderedSet<Guild>()

    try {
      while (true) {
        const gl = await this.client.getRESTGuilds(limit, last)

        out = out.union(gl)
        if (gl.length !== limit) {
          break
        }
      }
    } catch (e) {
      log.error('getAllGuilds failed', e)
      throw e
    }

    return out.toArray()
  }

  invalidateGuild (id: string) {
    this.cache.del(`G:${id}`)
  }
}
