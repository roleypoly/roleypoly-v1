const log = new (require('./logger'))('Roleypoly')
const Sequelize = require('sequelize')
const fetchModels = require('./models')
const fetchApis = require('./api')
const Next = require('next')


class Roleypoly {
  constructor (router, io, app) {
    this.router = router
    this.io = io
    this.ctx = {}

    this.ctx.config = {
      appUrl: process.env.APP_URL
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

  async mountRoutes () {
    await this.ctx.ui.prepare()

    fetchApis(this.router, this.ctx)

    // after routing, add the * for ui handler
    this.router.get('*', async ctx => {
      await this.ctx.uiHandler(ctx.req, ctx.res)
      ctx.respond = false
    })

    this.__app.use(this.router.middleware())
  }
}

module.exports = Roleypoly
