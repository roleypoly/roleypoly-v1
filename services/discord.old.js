/*
import Service from './Service'
import superagent from 'superagent'
// import invariant from 'invariant'
import { type AppContext } from '../Roleypoly'
import Eris from 'eris'
import Bot from '../bot'
import type { AuthTokens } from './auth'
export type UserPartial = {
  id: string,
  username: string,
  discriminator: string,
  avatar: string
}

export type Permissions = {
  isAdmin: boolean,
  canManageRoles: boolean
}

// type ChatCommandHandler = (message: Message, matches: string[], reply: (text: string) => Promise<Message>) => Promise<void>|void
// type ChatCommand = {
//   regex: RegExp,
//   handler: ChatCommandHandler
// }

class DiscordService extends Service {
  botToken: string = process.env.DISCORD_BOT_TOKEN || ''
  clientId: string = process.env.DISCORD_CLIENT_ID || ''
  clientSecret: string = process.env.DISCORD_CLIENT_SECRET || ''
  oauthCallback: string = process.env.OAUTH_AUTH_CALLBACK || ''
  isBot: boolean = process.env.IS_BOT === 'true'

  appUrl: string
  botCallback: string
  rootUsers: Set<string>
  client: Eris
  cmds: ChatCommand[]
  bot: Bot
  constructor (ctx: AppContext) {
    super(ctx)
    this.appUrl = ctx.config.appUrl

    this.oauthCallback = `${this.appUrl}/api/oauth/callback`
    this.botCallback = `${this.appUrl}/api/oauth/bot/callback`
    this.rootUsers = new Set((process.env.ROOT_USERS || '').split(','))
    this.bot = new Bot(this)
  }

  ownGm (server: string) {
    return this.gm(server, this.client.user.id)
  }

  fakeGm ({ id = '0', nickname = '[none]', displayHexColor = '#ffffff' }: $Shape<{ id: string, nickname: string, displayHexColor: string }>) { // eslint-disable-line no-undef
    return { id, nickname, displayHexColor, __faked: true, roles: { has () { return false } } }
  }

  isRoot (id: string): boolean {
    return this.rootUsers.has(id)
  }

  getRelevantServers (userId: string): Collection<string, Guild> {
    return this.client.guilds.filter((g) => g.members.has(userId))
  }

  gm (serverId: string, userId: string): ?GuildMember {
    const s = this.client.guilds.get(serverId)
    if (s == null) {
      return null
    }
    return s.members.get(userId)
  }

  getRoles (server: string) {
    const s = this.client.guilds.get(server)
    if (s == null) {
      return null
    }
    return s.roles
  }

  getPermissions (gm: GuildMember): Permissions {
    if (this.isRoot(gm.id)) {
      return {
        isAdmin: true,
        canManageRoles: true
      }
    }

    return {
      isAdmin: gm.permissions.has('ADMINISTRATOR'),
      canManageRoles: gm.permissions.has('MANAGE_ROLES', true)
    }
  }

  safeRole (server: string, role: string) {
    const rl = this.getRoles(server)
    if (rl == null) {
      throw new Error(`safeRole can't see ${server}`)
    }
    const r: ?Role = rl.get(role)
    if (r == null) {
      throw new Error(`safeRole can't find ${role} in ${server}`)
    }

    return r.editable && !r.hasPermission('MANAGE_ROLES', false, true)
  }

  // oauth step 2 flow, grab the auth token via code
  async getAuthToken (code: string): Promise<AuthTokens> {
    const url = 'https://discordapp.com/api/oauth2/token'
    try {
      const rsp =
        await superagent
          .post(url)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.oauthCallback
          })

      return rsp.body
    } catch (e) {
      this.log.error('getAuthToken failed', e)
      throw e
    }
  }

  async getUserFromToken (authToken?: string): Promise<UserPartial> {
    const url = 'https://discordapp.com/api/v6/users/@me'
    try {
      if (authToken == null || authToken === '') {
        throw new Error('not logged in')
      }

      const rsp =
        await superagent
          .get(url)
          .set('Authorization', `Bearer ${authToken}`)
      return rsp.body
    } catch (e) {
      this.log.error('getUser error', e)
      throw e
    }
  }

  getUserPartial (userId: string): ?UserPartial {
    const U = this.client.users.get(userId)
    if (U == null) {
      return null
    }

    return {
      username: U.username,
      discriminator: U.discriminator,
      avatar: U.displayAvatarURL,
      id: U.id
    }
  }

  async refreshOAuth ({ refreshToken }: { refreshToken: string }): Promise<AuthTokens> {
    const url = 'https://discordapp.com/api/oauth2/token'
    try {
      const rsp =
        await superagent
          .post(url)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            redirect_uri: this.oauthCallback
          })

      return rsp.body
    } catch (e) {
      this.log.error('refreshOAuth failed', e)
      throw e
    }
  }

  async revokeOAuth ({ accessToken }: { accessToken: string }) {
    const url = 'https://discordapp.com/api/oauth2/token/revoke'
    try {
      const rsp =
        await superagent
          .post(url)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'access_token',
            token: accessToken,
            redirect_uri: this.oauthCallback
          })

      return rsp.body
    } catch (e) {
      this.log.error('revokeOAuth failed', e)
      throw e
    }
  }

  // returns oauth authorize url with IDENTIFY permission
  // we only need IDENTIFY because we only use it for matching IDs from the bot
  getAuthUrl (state: string): string {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${this.oauthCallback}&response_type=code&scope=identify&state=${state}`
  }

  // returns the bot join url with MANAGE_ROLES permission
  // MANAGE_ROLES is the only permission we really need.
  getBotJoinUrl (): string {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.clientId}&scope=bot&permissions=268435456`
  }

  mentionResponse (message: Message) {
    message.channel.send(`🔰 Assign your roles here! ${this.appUrl}/s/${message.guild.id}`, { disableEveryone: true })
  }

  _cmds () {
    const cmds = [
      {
        regex: /say (.*)/,
        handler (message, matches, r) {
          r(matches[0])
        }
      },
      {
        regex: /set username (.*)/,
        async handler (message, matches) {
          const { username } = this.client.user
          await this.client.user.setUsername(matches[0])
          message.channel.send(`Username changed from ${username} to ${matches[0]}`)
        }
      },
      {
        regex: /stats/,
        async handler (message, matches) {
          const t = [
            `**Stats** 📈`,
            '',
            `👩‍❤️‍👩 **Users Served:** ${this.client.guilds.reduce((acc, g) => acc + g.memberCount, 0)}`,
            `🔰 **Servers:** ${this.client.guilds.size}`,
            `💮 **Roles Seen:** ${this.client.guilds.reduce((acc, g) => acc + g.roles.size, 0)}`
          ]
          message.channel.send(t.join('\n'))
        }
      }
    ]
      // prefix regex with ^ for ease of code
      .map(({ regex, ...rest }) => ({ regex: new RegExp(`^${regex.source}`, regex.flags), ...rest }))

    this.cmds = cmds
    return cmds
  }

  async handleCommand (message: Message) {
    const cmd = message.content.replace(`<@${this.client.user.id}> `, '')
    this.log.debug(`got command from ${message.author.username}`, cmd)
    for (let { regex, handler } of this.cmds) {
      const match = regex.exec(cmd)
      if (match !== null) {
        this.log.debug('command accepted', { cmd, match })
        try {
          await handler.call(this, message, match.slice(1))
          return
        } catch (e) {
          this.log.error('command errored', { e, cmd, message })
          message.channel.send(`❌ **An error occured.** ${e}`)
          return
        }
      }
    }

    // nothing matched?
    this.mentionResponse(message)
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

  handleDM (message: Message) {
    switch (message.content.toLowerCase()) {
      case 'login':
      case 'auth':
      case 'log in':
        this.issueChallenge(message)
    }
  }

  handleMessage (message: Message) {
    if (message.author.bot) { // drop bot messages
      return
    }

    if (message.channel.type === 'dm') {
      // handle dm
      return this.handleDM(message)
    }

    if (message.mentions.users.has(this.client.user.id)) {
      if (this.rootUsers.has(message.author.id)) {
        this.handleCommand(message)
      } else {
        this.mentionResponse(message)
      }
    }
  }

  async handleJoin (guild: Guild) {
    await this.ctx.server.ensure(guild)
  }
}

module.exports = DiscordService
*/