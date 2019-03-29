// @flow
import Service from './Service'
import type { AppContext } from '../Roleypoly'
import Bot from '../bot'
import Eris, { type Member, Role, type Guild, type Permission as ErisPermission } from 'eris'
import LRU from 'lru-cache'
// $FlowFixMe
import { OrderedSet } from 'immutable'
import superagent from 'superagent'
import type { AuthTokens } from './auth'
import type { IFetcher } from './discord/types'

type DiscordServiceConfig = {
  token: string,
  clientId: string,
  clientSecret: string,
  rootUsers: Set<string>,
  isBot: boolean
}

export type Permissions = {
  canManageRoles: boolean,
  isAdmin: boolean,
  faked?: boolean,
  __faked?: Permissions
}

type CachedRole = {
  id: string,
  position: number
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

export default class DiscordService extends Service {
  ctx: AppContext
  bot: Bot
  client: Eris

  cfg: DiscordServiceConfig

  // a small cache of role data for checking viability
  ownRoleCache: LRU<string, CachedRole>

  oauthCallback: string

  fetcher: IFetcher

  constructor (ctx: AppContext) {
    super(ctx)
    this.ctx = ctx

    this.cfg = {
      rootUsers: new Set((process.env.ROOT_USERS || '').split(',')),
      token: process.env.DISCORD_BOT_TOKEN || '',
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      isBot: process.env.IS_BOT === 'true'
    }

    this.oauthCallback = `${ctx.config.appUrl}/api/oauth/callback`

    this.ownRoleCache = new LRU()

    if (this.cfg.isBot) {
      this.client = new Eris(this.cfg.token, {
        disableEveryone: true,
        maxShards: 'auto',
        messageLimit: 10,
        disableEvents: {
          CHANNEL_PINS_UPDATE: true,
          USER_SETTINGS_UPDATE: true,
          USER_NOTE_UPDATE: true,
          RELATIONSHIP_ADD: true,
          RELATIONSHIP_REMOVE: true,
          GUILD_BAN_ADD: true,
          GUILD_BAN_REMOVE: true,
          TYPING_START: true,
          MESSAGE_UPDATE: true,
          MESSAGE_DELETE: true,
          MESSAGE_DELETE_BULK: true,
          VOICE_STATE_UPDATE: true
        }
      })
      this.bot = new Bot(this)
      const BotFetcher = require('./discord/botFetcher').default
      this.fetcher = new BotFetcher(this)
    } else {
      this.client = new Eris(`Bot ${this.cfg.token}`, {
        restMode: true
      })
      const RestFetcher = require('./discord/restFetcher').default
      this.fetcher = new RestFetcher(this)
    }
  }

  isRoot (id: string): boolean {
    return this.cfg.rootUsers.has(id)
  }

  getRelevantServers (user: string) {
    return this.client.guilds.filter(guild => guild.members.has(user))
  }

  gm (serverId: string, userId: string): ?Member {
    return this.client.guilds.get(serverId)?.members.get(userId)
  }

  ownGm (serverId: string) {
    return this.gm(serverId, this.client.user.id)
  }

  fakeGm ({ id = '0', nickname = '[none]', displayHexColor = '#ffffff' }: $Shape<Member>): $Shape<Member> {
    return { id, nickname, displayHexColor, __faked: true, roles: { has () { return false } } }
  }

  getRoles (server: string) {
    return this.client.guilds.get(server)?.roles
  }

  getOwnPermHeight (server: Guild): number {
    if (this.ownRoleCache.has(server)) {
      return this.ownRoleCache.get(server).position
    }

    const gm = this.ownGm(server.id)
    const g = gm?.guild
    const r: Role = OrderedSet(gm?.roles).map(id => g?.roles.get(id)).sortBy(r => r.position).last({ position: 0, id: '0' })
    this.ownRoleCache.set(server, {
      id: r.id,
      position: r.position
    })

    return r.position
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

  safeRole (server: string, role: string) {
    const r = this.getRoles(server)?.get(role)
    if (r == null) {
      throw new Error(`safeRole can't find ${role} in ${server}`)
    }

    return this.roleIsEditable(r) && !this.calcPerms(r).canManageRoles
  }

  roleIsEditable (role: Role): boolean {
    // role will be LOWER than my own
    return this.getOwnPermHeight(role.guild) > role.position
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

  getUserPartial (userId: string): ?UserPartial {
    const u = this.client.users.get(userId)
    if (u == null) {
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

  canManageRoles (server: string, user: string) {
    return this.getPermissions(this.gm(server, user)).canManageRoles
  }

  isMember (server: string, user: string) {
    return this.gm(server, user) != null
  }
}
