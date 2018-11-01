require('dotenv').config({silent: true})
const log = new (require('./logger'))('index')

const http = require('http')
const Koa = require('koa')
const app = new Koa()
const _io = require('socket.io')
const path = require('path')
const router = require('koa-better-router')().loadMethods()
const Roleypoly = require('./Roleypoly')
const ksuid = require('ksuid')

// monkey patch async-reduce because F U T U R E
Array.prototype.areduce = async function (predicate, acc = []) { // eslint-disable-line
  for (let i of this) {
    acc = await predicate(acc, i)
  }

  return acc
}

Array.prototype.filterNot = Array.prototype.filterNot || function (predicate) {
  return this.filter(v => !predicate(v))
}

// Create the server and socket.io server
const server = http.createServer(app.callback())
const io = _io(server, { transports: ['websocket'], path: '/api/socket.io', wsEngine: 'uws' })

const M = new Roleypoly(router, io, app) // eslint-disable-line no-unused-vars

app.keys = [ process.env.APP_KEY ]

const DEVEL = process.env.NODE_ENV === 'development'

async function start () {
  await M.awaitServices()

  // body parser
  const bodyParser = require('koa-bodyparser')
  app.use(bodyParser({ types: ['json'] }))

  // Compress
  const compress = require('koa-compress')
  app.use(compress())

  // SPA + Static
  if (process.env.NODE_ENV === 'production') {
    const pub = path.join(__dirname, 'public')

    const staticFiles = require('koa-static')
    app.use(staticFiles(pub, { defer: true }))

    const send = require('koa-send')
    app.use(async (ctx, next) => {
      if (ctx.path.startsWith('/api')) {
        return next()
      }

      await next()
      send(ctx, 'index.html', { root: pub })
    })
  }

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
    return null
  })

  const session = require('koa-session')
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
