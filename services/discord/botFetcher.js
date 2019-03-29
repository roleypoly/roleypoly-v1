// @flow
import type { IFetcher } from './types'
import type DiscordSvc from '../discord'
import type ErisClient from 'eris'

export default class BotFetcher implements IFetcher {
  ctx: DiscordSvc
  client: ErisClient
  constructor (ctx: DiscordSvc) {
    this.ctx = ctx
    this.client = ctx.client
  }

  getUser = async (id: string) => this.client.users.get(id)
  getMember = async (server: string, user: string) => this.client.guilds.get(server)?.members.get(user)
  getGuild = async (server: string) => this.client.guilds.get(server)
}
