const Service = require('./Service')
const superagent = require('superagent')
const {
  DiscordClient,
  Member,
  RoleTransaction,
  TxDelta,
} = require('@roleypoly/rpc/discord')
const { IDQuery, DiscordUser } = require('@roleypoly/rpc/shared')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const { NodeHttpTransport } = require('@improbable-eng/grpc-web-node-http-transport')
const LRU = require('lru-cache')

class DiscordService extends Service {
  constructor(ctx) {
    super(ctx)

    this.botToken = process.env.DISCORD_BOT_TOKEN
    this.clientId = process.env.DISCORD_CLIENT_ID
    this.clientSecret = process.env.DISCORD_CLIENT_SECRET
    this.oauthCallback = process.env.OAUTH_AUTH_CALLBACK
    this.botCallback = `${ctx.config.appUrl}/api/oauth/bot/callback`
    this.appUrl = process.env.APP_URL
    this.rootUsers = new Set((process.env.ROOT_USERS || '').split(','))

    this.rpcAddr = process.env.DISCORD_SVC_ADDR
    this.rpcSecret = process.env.SHARED_SECRET
    this.rpc = new DiscordClient(this.rpcAddr, { transport: NodeHttpTransport() })

    this.cache = new LRU({
      max: 500,
      maxAge: 2 /* minutes */ * 60 * 1000,
    })

    this.sharedHeaders = {
      Authorization: `Shared ${this.rpcSecret}`,
    }

    this.bootstrapRetries = 0
    this.bootstrapRetriesMax = 10

    this.bootstrap().catch((e) => {
      console.error(`bootstrap failure`, e)
      process.exit(-1)
    })
  }

  async bootstrap() {
    try {
      const ownUser = await this.rpc.ownUser(new Empty(), this.sharedHeaders)
      this.ownUser = ownUser.toObject()

      const listGuilds = await this.rpc.listGuilds(new Empty(), this.sharedHeaders)
      this.syncGuilds(listGuilds.toObject().guildsList)
    } catch (e) {
      this.bootstrapRetries++
      if (this.bootstrapRetries < this.bootstrapRetriesMax) {
        return setTimeout(() => this.bootstrap(), 1000)
      } else {
        throw e
      }
    }
  }

  ownGm(server) {
    return this.gm(server, this.ownUser.id)
  }

  /**
   * @returns Member.AsObject
   */
  fakeGm({ guildID, id = '0', nickname = '[none]', displayHexColor = '#ffffff' }) {
    return {
      guildID: guildID,
      roles: [],
      nick: nickname,
      user: {
        ID: id,
        username: nickname,
        discriminator: '0000',
        avatar: '',
        bot: false,
      },
      displayHexColor: 0,
    }
  }

  isRoot(id) {
    return this.rootUsers.has(id)
  }

  async getRelevantServers(userId) {
    return this.cacheCurry(`grs:${userId}`, async () => {
      const q = new IDQuery()
      q.setMemberid('' + userId)

      const guilds = await this.rpc.getGuildsByMember(q, this.sharedHeaders)
      this.syncGuilds(guilds.toObject().guildsList)
      return guilds.toObject().guildsList
    })
  }

  gm(serverId, userId) {
    return this.cacheCurry(`gm:${serverId}-${userId}`, async () => {
      const q = new IDQuery()
      q.setGuildid(serverId)
      q.setMemberid(userId)

      const member = await this.rpc.getMember(q, this.sharedHeaders)
      return member.toObject()
    })
  }

  getRoles(serverId) {
    return this.cacheCurry(`roles:${serverId}`, async () => {
      const q = new IDQuery()
      q.setGuildid(serverId)

      const roles = await this.rpc.getGuildRoles(q, this.sharedHeaders)
      return roles.toObject().rolesList.filter((role) => role.id !== serverId)
    })
  }

  getPermissions(gm, guildRoles, guild) {
    if (this.isRoot(gm.user.id)) {
      return {
        isAdmin: true,
        canManageRoles: true,
      }
    }

    const matchFor = (permissionInt) =>
      !!gm.rolesList
        .map((id) => guildRoles.find((role) => role.id === id))
        .filter((x) => !!x)
        .find((role) => (role.permissions & permissionInt) === permissionInt)

    const isAdmin = guild.ownerid === gm.user.id || matchFor(0x00000008)
    const canManageRoles = isAdmin || matchFor(0x10000000)

    return {
      isAdmin,
      canManageRoles,
    }
  }

  getServer(serverId) {
    return this.cacheCurry(`g:${serverId}`, async () => {
      const q = new IDQuery()
      q.setGuildid(serverId)

      const guild = await this.rpc.getGuild(q, this.sharedHeaders)
      this.ctx.servers.ensure(guild.toObject())
      return guild.toObject()
    })
  }

  async updateRoles(memberObj, newRoles) {
    memberObj.rolesList = newRoles
    const member = this.memberToProto(memberObj)
    await this.rpc.updateMember(member, this.sharedHeaders)
  }

  async updateRolesTx(memberObj, { added, removed }) {
    const roleTx = new RoleTransaction()
    roleTx.setMember(this.memberToQueryProto(memberObj))

    for (let toAdd of added) {
      const delta = new TxDelta()
      delta.setAction(TxDelta.Action.ADD)
      delta.setRole(toAdd)
      roleTx.addDelta(delta)
    }

    for (let toRemove of removed) {
      const delta = new TxDelta()
      delta.setAction(TxDelta.Action.REMOVE)
      delta.setRole(toRemove)
      roleTx.addDelta(delta)
    }

    return this.rpc.updateMemberRoles(roleTx, this.sharedHeaders)
  }

  memberToQueryProto(member) {
    const query = new IDQuery()
    query.setGuildid(member.guildid)
    query.setMemberid(member.user.id)
    return query
  }

  memberToProto(member) {
    const memberProto = new Member()
    memberProto.setGuildid(member.guildid)
    memberProto.setRolesList(member.rolesList)
    memberProto.setNick(member.nick)
    memberProto.setUser(this.userToProto(member.user))
    return memberProto
  }

  userToProto(user) {
    const userProto = new DiscordUser()
    userProto.setId(user.id)
    userProto.setUsername(user.username)
    userProto.setDiscriminator(user.discriminator)
    userProto.setAvatar(user.avatar)
    userProto.setBot(user.bot)
    return userProto
  }

  // oauth step 2 flow, grab the auth token via code
  async getAuthToken(code) {
    const url = 'https://discordapp.com/api/oauth2/token'
    try {
      const rsp = await superagent
        .post(url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.oauthCallback,
        })

      return rsp.body
    } catch (e) {
      this.log.error('getAuthToken failed', e)
      throw e
    }
  }

  async getUser(authToken) {
    const url = 'https://discordapp.com/api/v6/users/@me'
    try {
      if (authToken == null || authToken === '') {
        throw new Error('not logged in')
      }

      const rsp = await superagent.get(url).set('Authorization', `Bearer ${authToken}`)
      return rsp.body
    } catch (e) {
      this.log.error('getUser error', e)
      throw e
    }
  }

  // returns oauth authorize url with IDENTIFY permission
  // we only need IDENTIFY because we only use it for matching IDs from the bot
  getAuthUrl(state) {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${this.oauthCallback}&response_type=code&scope=identify&state=${state}`
  }

  // returns the bot join url with MANAGE_ROLES permission
  // MANAGE_ROLES is the only permission we really need.
  getBotJoinUrl() {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.clientId}&scope=bot&permissions=268435456`
  }

  async syncGuilds(guilds) {
    guilds.forEach((guild) => this.ctx.server.ensure(guild))
  }

  async cacheCurry(key, func) {
    if (process.env.DISABLE_CACHE === 'true') {
      return func()
    }

    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    const returnVal = await func()

    this.cache.set(key, returnVal)

    return returnVal
  }

  invalidate(deadKey) {
    const keys = this.cache.keys()
    for (let key of keys) {
      if (key.includes(deadKey)) {
        this.cache.del(key)
      }
    }
  }
}

module.exports = DiscordService
