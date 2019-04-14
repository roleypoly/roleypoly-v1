// @flow
import Service from './Service'
import type { AppContext } from '../Roleypoly'
import Eris, { type Member, Role, type Guild, type Permission as ErisPermission } from 'eris'
import LRU from 'lru-cache'
// $FlowFixMe
import { OrderedSet } from 'immutable'
import superagent from 'superagent'
import type { AuthTokens } from './auth'
import type { IFetcher } from './discord/types'
import RestFetcher from './discord/restFetcher'

type DiscordServiceConfig = {
  token: string,
  clientId: string,
  clientSecret: string,
  rootUsers: Set<string>
}

export type Permissions = {
  canManageRoles: boolean,
  isAdmin: boolean,
  faked?: boolean,
  __faked?: Permissions
}

type CachedRole = {
  id: string,
  position: number,
  color?: number
}

type OAuthRequestData = {
  grant_type: 'authorization_code',
  code: string
} | {
  grant_type: 'refresh_token',
  refresh_token: string
} | {
  grant_type: 'access_token',
  token: string
}

export type UserPartial = {
  id: string,
  username: string,
  discriminator: string,
  avatar: string
}

export type MemberExt = Member & {
  color?: number,
  __faked?: true
}

export default class DiscordService extends Service {
  ctx: AppContext
  client: Eris

  cfg: DiscordServiceConfig

  // a small cache of role data for checking viability
  ownRoleCache: LRU<string, CachedRole>
  topRoleCache: LRU<string, CachedRole>

  oauthCallback: string

  fetcher: IFetcher

  constructor (ctx: AppContext) {
    super(ctx)
    this.ctx = ctx

    this.cfg = {
      rootUsers: new Set((process.env.ROOT_USERS || '').split(',')),
      token: process.env.DISCORD_BOT_TOKEN || '',
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || ''
    }

    this.oauthCallback = `${ctx.config.appUrl}/api/oauth/callback`

    this.ownRoleCache = new LRU()
    this.topRoleCache = new LRU()

    this.client = new Eris(`Bot ${this.cfg.token}`, {
      restMode: true
    })

    this.fetcher = new RestFetcher(this)
  }

  isRoot (id: string): boolean {
    return this.cfg.rootUsers.has(id)
  }

  getRelevantServers (user: string) {
    return this.client.guilds.filter(guild => guild.members.has(user))
  }

  async gm (serverId: string, userId: string, { canFake = false }: { canFake: boolean } = {}): Promise<?MemberExt> {
    const gm: ?Member = await this.fetcher.getMember(serverId, userId)
    if (gm == null && this.isRoot(userId)) {
      return this.fakeGm({ id: userId })
    }

    if (gm == null) {
      return null
    }

    const out: MemberExt = gm
    out.color = this.getHighestRole(gm).color
    return out
  }

  ownGm (serverId: string) {
    return this.gm(serverId, this.client.user.id)
  }

  fakeGm ({ id = '0', nick = '[none]', color = 0 }: $Shape<MemberExt>): $Shape<MemberExt> {
    return { id, nick, color, __faked: true, roles: [] }
  }

  getRoles (server: string) {
    return this.client.guilds.get(server)?.roles
  }

  async getOwnPermHeight (server: Guild): Promise<number> {
    if (this.ownRoleCache.has(server)) {
      const r = this.ownRoleCache.get(server)
      return r.position
    }

    const gm = await this.ownGm(server.id)
    const g = gm?.guild
    const r: Role = OrderedSet(gm?.roles).map(id => g?.roles.get(id)).minBy(r => r.position)
    this.ownRoleCache.set(server, {
      id: r.id,
      position: r.position
    })

    return r.position
  }

  getHighestRole (gm: MemberExt): Role {
    const trk = `${gm.guild.id}:${gm.id}`
    if (this.topRoleCache.has(trk)) {
      const r = gm.guild.roles.get(this.topRoleCache.get(trk).id)
      if (r != null) {
        return r
      }
    }

    const g = gm.guild
    const top = OrderedSet(gm.roles).map(id => g.roles.get(id)).minBy(r => r.position)
    this.topRoleCache.set(trk, {
      id: top.id,
      position: top.position,
      color: top.color
    })

    return top
  }

  calcPerms (permable: Role | Member): Permissions {
    const p: ErisPermission = (permable instanceof Role) ? permable.permissions : permable.permission
    return {
      isAdmin: p.has('administrator'),
      canManageRoles: p.has('manageRoles') || p.has('administrator')
    }
  }

  getPermissions (gm: Member): Permissions {
    const real = this.calcPerms(gm)

    if (this.isRoot(gm.id)) {
      return {
        isAdmin: true,
        canManageRoles: true,
        faked: true,
        __faked: real
      }
    }

    return real
  }

  async safeRole (server: string, role: string) {
    const r = this.getRoles(server)?.get(role)
    if (r == null) {
      throw new Error(`safeRole can't find ${role} in ${server}`)
    }

    return (await this.roleIsEditable(r)) && !this.calcPerms(r).canManageRoles
  }

  async roleIsEditable (role: Role): Promise<boolean> {
    // role will be LOWER than my own
    const ownPh = await this.getOwnPermHeight(role.guild)
    return ownPh > role.position
  }

  async oauthRequest (path: string, data: OAuthRequestData) {
    const url = `https://discordapp.com/api/oauth2/${path}`
    try {
      const rsp = await superagent.post(url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('User-Agent', 'DiscordBot (https://roleypoly.com, 2.x.x) OAuthHandler/1.0')
        .send({
          client_id: this.cfg.clientId,
          client_secret: this.cfg.clientSecret,
          redirect_uri: this.oauthCallback,
          ...data
        })

      return (rsp.body: AuthTokens)
    } catch (e) {
      this.log.error('oauthRequest failed', { e, path })
      throw e
    }
  }

  initializeOAuth (code: string) {
    return this.oauthRequest('token', {
      grant_type: 'authorization_code',
      code
    })
  }

  refreshOAuth ({ refreshToken }: { refreshToken: string }) {
    return this.oauthRequest('token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  }

  revokeOAuth ({ accessToken }: { accessToken: string }) {
    return this.oauthRequest('token/revoke', {
      grant_type: 'access_token',
      token: accessToken
    })
  }

  async getUserPartial (userId: string): Promise<?UserPartial> {
    const u = await this.fetcher.getUser(userId)
    if (u == null) {
      this.log.debug('userPartial got a null user', userId, u)
      return null
    }

    return {
      username: u.username,
      discriminator: u.discriminator,
      avatar: u.avatarURL,
      id: u.id
    }
  }

  async getUserFromToken (authToken: string): Promise<UserPartial> {
    const url = 'https://discordapp.com/api/v6/users/@me'
    try {
      const rsp = await superagent.get(url)
        .set('User-Agent', 'DiscordBot (https://roleypoly.com, 2.x.x) OAuthHandler/1.0')
        .set('Authorization', `Bearer ${authToken}`)

      return rsp.body
    } catch (e) {
      this.log.error('getUser error', e)
      throw e
    }
  }

  getAuthUrl (state: string): string {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.cfg.clientId}&redirect_uri=${this.oauthCallback}&response_type=code&scope=identify&state=${state}`
  }

  // returns the bot join url with MANAGE_ROLES permission
  // MANAGE_ROLES is the only permission we really need.
  getBotJoinUrl (): string {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.cfg.clientId}&scope=bot&permissions=268435456`
  }

  async issueChallenge (author: string) {
    // Create a challenge
    const chall = await this.ctx.auth.createDMChallenge(author)

    const randomLines = [
      '🐄 A yellow cow is only as bright as it lets itself be. ✨',
      '‼ **Did you know?** On this day, at least one second ago, you were right here!',
      '<:AkkoC8:437428070849314816> *Reticulating splines...*',
      'Also, you look great today <:YumekoWink:439519270376964107>',
      'btw, ur bright like a <:diamond:544665968631087125>',
      `🌈 psst! pssssst! I'm an expensive bot, would you please spare some change? <https://ko-fi.com/roleypoly>`,
      '📣 have suggestions? wanna help out? join my discord! <https://discord.gg/PWQUVsd>\n*(we\'re nice people, i swear!)*',
      `🤖 this bot is at least ${Math.random() * 100}% LIT 🔥`,
      '💖 wanna contribute to these witty lines? <https://discord.gg/PWQUVsd> suggest them on our discord!',
      '🛠 I am completely open source, check me out!~ <https://github.com/kayteh/roleypoly>'
    ]

    return ([
      '**Hey there!** <a:StockKyaa:435353158462603266>',
      '',
      `Use this secret code: **${chall.human}**`,
      `Or, click here: <${this.ctx.config.appUrl}/magic/${chall.magic}>`,
      '',
      'This code will self-destruct in 1 hour.',
      '---',
      randomLines[Math.floor(Math.random() * randomLines.length)]
    ].join('\n'))
  }

  async canManageRoles (server: string, user: string): Promise<boolean> {
    const gm = await this.gm(server, user)
    if (gm == null) {
      return false
    }

    return this.getPermissions(gm).canManageRoles
  }

  isMember (server: string, user: string): boolean {
    return this.gm(server, user) != null
  }

  async isValidUser (user: string): Promise<boolean> {
    const u = await this.fetcher.getUser(user)
    if (u != null) {
      return true
    }

    return false
  }
}
