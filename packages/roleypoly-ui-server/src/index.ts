import 'dotenv/config'
import Koa, { Context } from 'koa'
import connector from '@roleypoly/ui/connector'
import { Mappings } from '@roleypoly/ui/mappings'
import betterRouter from 'koa-better-router'
import compress from 'kompression'

type HTTPHandler = (path: string, handler: (ctx: Context, next: () => void) => any) => void
export type Router = {
  get: HTTPHandler,
  post: HTTPHandler,
  patch: HTTPHandler,
  delete: HTTPHandler,
  put: HTTPHandler,
  middleware: () => any
}

const app = new Koa()

const isDev = process.env.NODE_ENV === 'development'

function loadRoutes (next: any, routeMapping: Mappings): Function {
  const router: Router = betterRouter().loadMethods()
  const nextHandler = next.getRequestHandler()

  // UI dynamic mappings
  for (let mapping in routeMapping) {
    const { path, noAutoFix, custom } = routeMapping[mapping]

  // render the path if mapping is GET-ted
    router.get(mapping, (ctx: Context) => {
      ctx.status = 200
      return next.render(ctx.req, ctx.res, path, { ...ctx.query, ...ctx.params })
    })

  // redirect the inverse path if there isn't a parameter
    if (!noAutoFix) {
      router.get(path, (ctx: Context) => ctx.redirect(mapping))
    }

  // all else, if custom exists, we call it.
  // this solves edge cases per route.
    if (custom !== undefined) {
      custom(router as any)
    }
  }

// handle all else
  router.get('*', async (ctx: Context) => {
    await nextHandler(ctx.req, ctx.res)
    ctx.respond = false
  })

  return router.middleware()
}

async function start () {
  app.use(compress())

  const next = connector({ dev: isDev })
  await next.prepare()

  const mappings = require('@roleypoly/ui/mappings')
  let mw = loadRoutes(next, mappings)

  if (isDev) {
    const { hotReloader } = require('./dev-server')
    mw = hotReloader(
      require.resolve('@roleypoly/ui/mappings'),
      () => {
        const newMappings = require('@roleypoly/ui/mappings')
        return loadRoutes(next, newMappings)
      }
    )
  }

  app.use(mw as any)

  app.listen(process.env.UI_PORT || '6768')
}

start().catch((e: Error) => {
  console.error('app failed to start', e)
})
