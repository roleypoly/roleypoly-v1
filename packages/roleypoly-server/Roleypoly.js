// @flow
import Sequelize from 'sequelize'
import Next from 'next'
import betterRouter from 'koa-better-router'
import type EventEmitter from 'events'
import fs from 'fs'
import logger from './logger'
import ServerService from './services/server'
import DiscordService from './services/discord'
import SessionService from './services/sessions'
import AuthService from './services/auth'
import PresentationService from './services/presentation'
import RPCServer from './rpc'
import fetchModels, { type Models } from './models'
import fetchApis from './api'

import type SocketIO from 'socket.io'
import type KoaApp, { Context } from 'koa'

const log = logger(__filename)

type HTTPHandler = (path: string, handler: (ctx: Context, next: () => void) => any) => void
export type Router = {
  get: HTTPHandler,
  post: HTTPHandler,
  patch: HTTPHandler,
  delete: HTTPHandler,
  put: HTTPHandler,
  middleware: () => any
}

export type RouteHook = (router: Router) => void

export type AppContext = {
  config: {
    appUrl: string,
    dev: boolean,
    hotReload: boolean
  },
  ui: Next,
  uiHandler: Next.Handler,
  io: SocketIO,

  server: ServerService,
  discord: DiscordService,
  sessions: SessionService,
  P: PresentationService,
  RPC: RPCServer,
  M: Models,
  sql: Sequelize,
  auth: AuthService
}

class Roleypoly {
  ctx: AppContext|any
  io: SocketIO
  router: Router

  M: Models

  __app: KoaApp
  __initialized: Promise<void>
  __apiWatcher: EventEmitter
  __rpcWatcher: EventEmitter

  __routeHooks: Set<RouteHook> = new Set()
  constructor (io: SocketIO, app: KoaApp) {
    this.io = io
    this.__app = app

    if (log.debugOn) log.warn('debug mode is on')

    const dev = process.env.NODE_ENV !== 'production'

    // simple check if we're in a compiled situation or not.
    let uiDir = './ui'
    if (!fs.existsSync(uiDir) && fs.existsSync('../ui')) {
      uiDir = '../ui'
    }

    const ui = Next({ dev, dir: uiDir })
    const uiHandler = ui.getRequestHandler()

    const appUrl = process.env.APP_URL
    if (appUrl == null) {
      throw new Error('APP_URL was unset.')
    }

    this.ctx = {
      config: {
        appUrl,
        dev,
        hotReload: process.env.NO_HOT_RELOAD !== '1'
      },
      io,
      ui,
      uiHandler
    }

    this.__initialized = this._mountServices()
  }

  async awaitServices () {
    await this.__initialized
  }

  async _mountServices () {
    const dbUrl: ?string = process.env.DB_URL
    if (dbUrl == null) {
      throw log.fatal('DB_URL not set.')
    }

    const sequelize = new Sequelize(dbUrl, { logging: log.sql.bind(log, log) })
    this.ctx.sql = sequelize
    this.M = fetchModels(sequelize)
    this.ctx.M = this.M
    if (!process.env.DB_NO_SYNC) {
      await sequelize.sync()
    }

    this.ctx.server = new ServerService(this.ctx)
    this.ctx.discord = new DiscordService(this.ctx)
    this.ctx.sessions = new SessionService(this.ctx)
    this.ctx.auth = new AuthService(this.ctx)
    this.ctx.P = new PresentationService(this.ctx)
    this.ctx.RPC = new RPCServer(this)
  }

  addRouteHook (hook: RouteHook) {
    this.__routeHooks.add(hook)
  }

  hookServiceRoutes (router: Router) {
    for (let h of this.__routeHooks) {
      h(router)
    }
  }

  async loadRoutes (forceClear: boolean = false) {
    await this.ctx.ui.prepare()

    this.router = betterRouter().loadMethods()
    fetchApis(this.router, this.ctx, { forceClear })
    // this.ctx.RPC.hookRoutes(this.router)

    this.hookServiceRoutes(this.router)

    // after routing, add the * for ui handler
    this.router.get('*', async ctx => {
      await this.ctx.uiHandler(ctx.req, ctx.res)
      ctx.respond = false
    })

    return this.router.middleware()
  }

  async mountRoutes () {
    let mw = await this.loadRoutes()

    if (this.ctx.config.dev && this.ctx.config.hotReload) {
      // hot-reloading system
      log.info('API hot-reloading is active.')
      const chokidar = require('chokidar')
      let hotMiddleware = mw

      this.__apiWatcher = chokidar.watch('api/**')
      this.__apiWatcher.on('all', async (path) => {
        log.info('reloading APIs...', path)
        hotMiddleware = await this.loadRoutes(true)
      })

      this.__rpcWatcher = chokidar.watch('rpc/**')
      this.__rpcWatcher.on('all', (path) => {
        log.info('reloading RPCs...', path)
        this.ctx.RPC.reload()
      })

      // custom passthrough so we use a specially scoped middleware.
      mw = (ctx, next) => {
        return hotMiddleware(ctx, next)
      }
    }

    this.__app.use(mw)
  }
}

module.exports = Roleypoly
