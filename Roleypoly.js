const log = new (require('./logger'))('Roleypoly')
const Sequelize = require('sequelize')
const fetchModels = require('./models')
const fetchApis = require('./api')
const Next = require('next')
const betterRouter = require('koa-better-router')

class Roleypoly {
  constructor (io, app) {
    this.io = io
    this.ctx = {}

    this.ctx.config = {
      appUrl: process.env.APP_URL,
      dev: process.env.NODE_ENV !== 'production',
      hotReload: process.env.NO_HOT_RELOAD !== '1'
    }

    this.ctx.io = io
    this.__app = app

    if (log.debugOn) log.warn('debug mode is on')

    const dev = process.env.NODE_ENV !== 'production'
    this.ctx.ui = Next({ dev, dir: './ui' })
    this.ctx.uiHandler = this.ctx.ui.getRequestHandler()

    this.__initialized = this._mountServices()
  }

  async awaitServices () {
    await this.__initialized
  }

  async _mountServices () {
    const sequelize = new Sequelize(process.env.DB_URL, { logging: log.sql.bind(log, log) })
    this.ctx.sql = sequelize
    this.M = fetchModels(sequelize)
    this.ctx.M = this.M
    await sequelize.sync()

    // this.ctx.redis = new (require('ioredis'))({
    //   port: process.env.REDIS_PORT || '6379',
    //   host: process.env.REDIS_HOST || 'localhost',
    //   parser: 'hiredis',
    //   dropBufferSupport: true,
    //   enableReadyCheck: true,
    //   enableOfflineQueue: true
    // })
    this.ctx.server = new (require('./services/server'))(this.ctx)
    this.ctx.discord = new (require('./services/discord'))(this.ctx)
    this.ctx.sessions = new (require('./services/sessions'))(this.ctx)
    this.ctx.P = new (require('./services/presentation'))(this.ctx)
  }

  async loadRoutes (forceClear = false) {
    await this.ctx.ui.prepare()

    this.router = betterRouter().loadMethods()
    fetchApis(this.router, this.ctx, { forceClear })

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

      // custom passthrough so we use a specially scoped middleware.
      mw = (ctx, next) => {
        return hotMiddleware(ctx, next)
      }
    }

    this.__app.use(mw)
  }
}

module.exports = Roleypoly
