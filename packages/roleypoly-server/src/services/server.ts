// @flow
import Service from './Service'
import { AppContext } from '../Roleypoly'
import PresentationService from './presentation'
import { Guild } from 'eris'
import { ServerModel, Category } from '@roleypoly/types'

export default class ServerService extends Service {
  Server: any // Model<ServerModel> but flowtype is bugged
  P: PresentationService
  constructor (ctx: AppContext) {
    super(ctx)
    this.Server = ctx.M.Server
    this.P = ctx.P
  }

  async ensure (server: Guild) {
    let srv: ServerModel | undefined = undefined
    try {
      srv = await this.get(server.id)
    } catch (e) {
      this.log.info('creating server', server.id)
    }

    if (srv === undefined) {
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

  async update (id: string, newData: Partial<ServerModel>) { // eslint-disable-line no-undef
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
    const categories: Category[] = Object.values(server.categories)
    const allowed: string[] = []

    for (const c of categories) {
      if (c.hidden !== true) {
        allowed.concat(c.roles)
      }
    }

    return allowed
  }
}
