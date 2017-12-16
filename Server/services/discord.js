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

    this.client = new discord.Client()

    this.startBot()

  }

  async startBot () {
    await this.client.login(this.botToken)
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
    return {
      isAdmin: gm.permissions.hasPermission('ADMINISTRATOR'),
      canManageRoles: gm.permissions.hasPermission('MANAGE_ROLES', false, true)
    }
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
    return `https://discordapp.com/oauth2/authorize?client_id=${this.clientId}&scope=bot&permissions=268435456&redirect_uri=${this.botCallback}`
  }
}

module.exports = DiscordService
