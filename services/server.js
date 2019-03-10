// @flow
import Service from './Service'
import { type AppContext } from '../Roleypoly'
import type PresentationService from './presentation'
import {
  type Guild
} from 'discord.js'
import { type ServerModel, type Category } from '../models/Server'

export default class ServerService extends Service {
  Server: any // Model<ServerModel> but flowtype is bugged
  P: PresentationService
  constructor (ctx: AppContext) {
    super(ctx)
    this.Server = ctx.M.Server
    this.P = ctx.P
  }

  async ensure (server: Guild) {
    let srv
    try {
      srv = await this.get(server.id)
    } catch (e) {

    }

    if (srv == null) {
      return this.create({
        id: server.id,
        message: '',
        categories: {}
      })
    }
  }

  create ({ id, message, categories }: ServerModel) {
    const srv = this.Server.build({ id, message, categories })

    return srv.save()
  }

  async update (id: string, newData: $Shape<ServerModel>) { // eslint-disable-line no-undef
    const srv = await this.get(id, false)

    return srv.update(newData)
  }

  async get (id: string, plain: boolean = true) {
    const s = await this.Server.findOne({
      where: {
        id
      }
    })

    if (!plain) {
      return s
    }

    return s.get({ plain: true })
  }

  async getAllowedRoles (id: string) {
    const server: ServerModel = await this.get(id)
    const categories: Category[] = (Object.values(server.categories): any)
    const allowed: string[] = []

    for (const c of categories) {
      if (c.hidden !== true) {
        allowed.concat(c.roles)
      }
    }

    return allowed
  }
}
