import 'dotenv/config'
import Koa, { Context } from 'koa'
import mappings from '@roleypoly/ui/mappings'
import connector from '@roleypoly/ui/connector'
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

async function start () {
  const router: Router = betterRouter().loadMethods()

  app.use(compress())

  const next = connector({ dev: process.env.NODE_ENV === 'development' })
  await next.prepare()
  const nextHandler = next.getRequestHandler()

  // UI dynamic mappings
  for (let mapping in mappings) {
    const { path, noAutoFix, custom } = mappings[mapping] as { path: string, noAutoFix?: boolean, custom?: (router: Router) => void }

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
      custom(router)
    }
  }

  // handle all else
  router.get('*', async (ctx: Context) => {
    await nextHandler(ctx.req, ctx.res)
    ctx.respond = false
  })

  app.listen(process.env.UI_PORT || '6768')
}

start().catch((e: Error) => {
  console.error('app failed to start', e)
})
