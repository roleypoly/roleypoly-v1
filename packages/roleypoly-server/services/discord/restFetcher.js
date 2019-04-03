// @flow
import type { IFetcher } from './types'
import type DiscordSvc from '../discord'
import type ErisClient, { User, Member, Guild } from 'eris'

export default class BotFetcher implements IFetcher {
  ctx: DiscordSvc
  client: ErisClient
  constructor (ctx: DiscordSvc) {
    this.ctx = ctx
    this.client = ctx.client
  }

  getUser = async (id: string): Promise<?User> => {
    try {
      return await this.client.getRESTUser(id)
    } catch (e) {
      return null
    }
  }
  getMember = async (server: string, user: string): Promise<?Member> => {
    try {
      return await this.client.getRESTGuildMember(server, user)
    } catch (e) {
      return null
    }
  }

  getGuild = async (server: string): Promise<?Guild> => {
    try {
      return await this.client.getRESTGuild(server)
    } catch (e) {
      return null
    }
  }
}
