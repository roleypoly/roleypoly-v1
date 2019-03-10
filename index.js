// @flow
import 'dotenv/config'
import logger from './logger'
import http from 'http'
import Koa from 'koa'
import SocketIO from 'socket.io'
import Roleypoly from './Roleypoly'
import ksuid from 'ksuid'
import bodyParser from 'koa-bodyparser'
import compress from 'kompression'
import session from 'koa-session'
import invariant from 'invariant'
import Keygrip from 'keygrip'

const log = logger(__filename)
const app = new Koa()

// monkey patch async-reduce because F U T U R E

// Create the server and socket.io server
const server = http.createServer(app.callback())
const io = SocketIO(server, { transports: ['websocket'], path: '/api/socket.io' })

const M = new Roleypoly(io, app) // eslint-disable-line no-unused-vars

const appKey = process.env.APP_KEY
if (appKey == null) {
  throw invariant(false, '')
}
app.keys = new Keygrip([ appKey ])

const DEVEL = process.env.NODE_ENV === 'development'

async function start () {
  await M.awaitServices()

  // body parser
  app.use(bodyParser())

  // Compress
  app.use(compress())

  // Request logger
  app.use(async (ctx, next) => {
    let timeStart = new Date()
    try {
      await next()
    } catch (e) {
      log.error(e)
      ctx.status = ctx.status || 500
      if (DEVEL) {
        ctx.body = ctx.body || e.stack
      } else {
        ctx.body = {
          err: 'something terrible happened.'
        }
      }
    }
    let timeElapsed = new Date() - timeStart

    log.request(`${ctx.status} ${ctx.method} ${ctx.url} - ${ctx.ip} - took ${timeElapsed}ms`)
    // return null
  })

  app.use(session({
    key: 'roleypoly:sess',
    maxAge: 'session',
    siteOnly: true,
    store: M.ctx.sessions,
    genid: () => { return ksuid.randomSync().string }
  }, app))

  await M.mountRoutes()

  // SPA server

  log.info(`starting HTTP server on ${process.env.APP_PORT || 6769}`)
  server.listen(process.env.APP_PORT || 6769)
}

start().catch(e => {
  log.fatal('app failed to start', e)
})
