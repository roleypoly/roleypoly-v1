// @flow
import Sequelize from 'sequelize'
import Next from 'next'
import betterRouter from 'koa-better-router'
import EventEmitter from 'events'
import logger from './logger'
import ServerService from './services/server'
import DiscordService from './services/discord'
import SessionService from './services/sessions'
import AuthService from './services/auth'
import PresentationService from './services/presentation'
import fetchModels, { Models } from './models'
import fetchApis from './api'
import retry from 'async-retry'

import KoaApp, { Context } from 'koa'
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

export type KoaContextExt = KoaApp.Context & {
  request: {
    body: any
  },
  session: {
    [x: string]: any
  }
}

export type AppContext = {
  config: {
    appUrl: string,
    dev: boolean,
    hotReload: boolean,
    sharedSecret: string
  },
  ui: Next,
  uiHandler: Next.Handler,
  // io: SocketIO,

  server: ServerService,
  discord: DiscordService,
  sessions: SessionService,
  P: PresentationService,
  // RPC: RPCServer,
  M: Models,
  sql: Sequelize.Sequelize,
  auth: AuthService
}

export default class Roleypoly {
  ctx: AppContext | any
  router: Router

  M: Models

  // private app: KoaApp
  private initialized: Promise<void>
  private apiWatcher: EventEmitter
  private rpcWatcher: EventEmitter

  private routeHooks: Set<RouteHook> = new Set()
  constructor (
    io: undefined,
    private app: KoaApp
  ) {
    // this.io = io

    if (log.debugOn) log.warn('debug mode is on')

    const dev = process.env.NODE_ENV !== 'production'

    const appUrl = process.env.APP_URL
    if (appUrl === undefined) {
      throw new Error('APP_URL was unset.')
    }

    this.ctx = {
      config: {
        appUrl,
        dev,
        hotReload: process.env.NO_HOT_RELOAD !== '1',
        sharedSecret: process.env.SHARED_SECRET
      },
      io
    }

    this.initialized = this._mountServices()
  }

  async awaitServices () {
    await this.initialized
  }

  async _mountServices () {
    const dbUrl: string = process.env.DB_URL || ''
    if (dbUrl === '') {
      throw log.fatal('DB_URL not set.')
    }

    await this.ctx.ui.prepare()

    const sequelize = new Sequelize.Sequelize(dbUrl, { logging: log.sql.bind(log, log) })
    this.ctx.sql = sequelize
    this.M = fetchModels(sequelize)
    this.ctx.M = this.M

    await retry(async bail => {
      try {
        await sequelize.authenticate()
      } catch (e) {
        log.error('sequelize failed to connect.', e.message)
        throw e
      }
    })

    if (!process.env.DB_NO_SYNC) {
      await this.ctx.sql.sync()
    }

    this.ctx.server = new ServerService(this.ctx)
    this.ctx.discord = new DiscordService(this.ctx)
    this.ctx.sessions = new SessionService(this.ctx)
    this.ctx.auth = new AuthService(this.ctx)
    this.ctx.P = new PresentationService(this.ctx)
    // this.ctx.RPC = new RPCServer(this)
  }

  addRouteHook (hook: RouteHook) {
    this.routeHooks.add(hook)
  }

  hookServiceRoutes (router: Router) {
    for (let h of this.routeHooks) {
      h(router)
    }
  }

  async loadRoutes (forceClear: boolean = false) {
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
      const path = require('path')
      let hotMiddleware = mw

      this.apiWatcher = chokidar.watch(path.join(__dirname, 'api/**'))
      this.apiWatcher.on('all', async (path) => {
        log.info('reloading APIs...', path)
        hotMiddleware = await this.loadRoutes(true)
      })

      this.rpcWatcher = chokidar.watch(path.join(__dirname, 'rpc/**'))
      this.rpcWatcher.on('all', (path) => {
        log.info('reloading RPCs...', path)
        this.ctx.RPC.reload()
      })

      // custom passthrough so we use a specially scoped middleware.
      mw = (ctx, next) => {
        return hotMiddleware(ctx, next)
      }
    }

    this.app.use(mw)
  }
}
