const Service = require('./Service')
const discord = require('discord.js')
const superagent = require('superagent')

class DiscordService extends Service {
  constructor (ctx) {
    super(ctx)

    this.botToken = process.env.DISCORD_BOT_TOKEN
    this.clientId = process.env.DISCORD_CLIENT_ID
    this.clientSecret = process.env.DISCORD_CLIENT_SECRET
    this.oauthCallback = process.env.OAUTH_AUTH_CALLBACK
    this.botCallback = `${ctx.config.appUrl}/api/oauth/bot/callback`
    this.appUrl = process.env.APP_URL
    this.isBot = process.env.IS_BOT === 'true' || false
    this.rootUsers = new Set((process.env.ROOT_USERS || '').split(','))

    this.client = new discord.Client()
    this.client.options.disableEveryone = true

    this.cmds = this._cmds()

    this.startBot()
  }

  ownGm (server) {
    return this.gm(server, this.client.user.id)
  }

  fakeGm ({ id = 0, nickname = '[none]', displayHexColor = '#ffffff' }) {
    return { id, nickname, displayHexColor, __faked: true, roles: { has () { return false } } }
  }

  isRoot (id) {
    return this.rootUsers.has(id)
  }

  async startBot () {
    await this.client.login(this.botToken)

    // not all roleypolys are bots.
    if (this.isBot) {
      this.log.info('this roleypoly is a bot')
      this.client.on('message', this.handleMessage.bind(this))
      this.client.on('guildCreate', this.handleJoin.bind(this))
    }

    for (let server of this.client.guilds.array()) {
      await this.ctx.server.ensure(server)
    }
  }

  getRelevantServers (userId) {
    return this.client.guilds.filter((g) => g.members.has(userId))
  }

  gm (serverId, userId) {
    return this.client.guilds.get(serverId).members.get(userId)
  }

  getRoles (server) {
    return this.client.guilds.get(server).roles
  }

  getPermissions (gm) {
    if (this.isRoot(gm.id)) {
      return {
        isAdmin: true,
        canManageRoles: true
      }
    }

    return {
      isAdmin: gm.permissions.hasPermission('ADMINISTRATOR'),
      canManageRoles: gm.permissions.hasPermission('MANAGE_ROLES', false, true)
    }
  }

  safeRole (server, role) {
    const r = this.getRoles(server).get(role)
    return r.editable && !r.hasPermission('MANAGE_ROLES', false, true)
  }

  // oauth step 2 flow, grab the auth token via code
  async getAuthToken (code) {
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

  async getUser (authToken) {
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

  // on sign out, we revoke the token we had.
  // async revokeAuthToken (code, state) {
  //   const url = 'https://discordapp.com/api/oauth2/revoke'
  //   try {
  //     const rsp =
  //       await superagent
  //         .post(url)
  //         .send({
  //           client_id: this.clientId,
  //           client_secret: this.clientSecret,
  //           grant_type: 'authorization_code',
  //           code: code,
  //           redirect_uri: this.oauthCallback
  //         })

  //     return rsp.body
  //   } catch (e) {
  //     this.log.error('getAuthToken failed', e)
  //     throw e
  //   }
  // }

  // returns oauth authorize url with IDENTIFY permission
  // we only need IDENTIFY because we only use it for matching IDs from the bot
  getAuthUrl (state) {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${this.oauthCallback}&response_type=code&scope=identify&state=${state}`
  }

  // returns the bot join url with MANAGE_ROLES permission
  // MANAGE_ROLES is the only permission we really need.
  getBotJoinUrl () {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.clientId}&scope=bot&permissions=268435456`
  }

  mentionResponse (message) {
    message.channel.send(`🔰 Assign your roles here! <${this.appUrl}/s/${message.guild.id}>`, { disableEveryone: true })
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

    return cmds
  }

  async handleCommand (message) {
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

  handleMessage (message) {
    if (message.author.bot && message.channel.type !== 'text') { // drop bot messages and dms
      return
    }

    if (message.mentions.users.has(this.client.user.id)) {
      if (this.rootUsers.has(message.author.id)) {
        this.handleCommand(message)
      } else {
        this.mentionResponse(message)
      }
    }
  }

  async handleJoin (guild) {
    await this.ctx.server.ensure(guild)
  }
}

module.exports = DiscordService
