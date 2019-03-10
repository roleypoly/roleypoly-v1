// @flow
import logger from '../logger'
import fnv from 'fnv-plus'
import autoloader from './_autoloader'
import RPCError from './_error'
import type Roleypoly from '../Roleypoly'
import type betterRouter from 'koa-better-router'
import { type Context } from 'koa'
const log = logger(__filename)

export default class RPCServer {
  ctx: Roleypoly

  rpcMap: {
    [rpc: string]: Function
  }

  mapHash: string
  rpcCalls: { name: string, args: number }[]

  constructor (ctx: Roleypoly) {
    this.ctx = ctx
    this.reload()
  }

  reload () {
    // actual function map
    this.rpcMap = autoloader(this.ctx.ctx)

    // hash of the map
    // used for known-reloads in the client.
    this.mapHash = fnv.hash(Object.keys(this.rpcMap)).str()

    // call map for the client.
    this.rpcCalls = Object.keys(this.rpcMap).map(fn => ({ name: this.rpcMap[fn].name, args: 0 }))
  }

  hookRoutes (router: betterRouter) {
    // RPC call reporter.
    // this is NEVER called in prod.
    // it is used to generate errors if RPC calls don't exist or are malformed in dev.
    router.get('/api/_rpc', async (ctx) => {
      ctx.body = {
        hash: this.mapHash,
        available: this.rpcCalls
      }
      ctx.status = 200
      return true
    })

    router.post('/api/_rpc', this.handleRPC.bind(this))
  }

  async handleRPC (ctx: Context) {
    // handle an impossible situation
    if (!(ctx.request.body instanceof Object)) {
      return this.rpcError(ctx, null, new RPCError('RPC format was very incorrect.', 400))
    }

    // check if RPC exists
    const { fn, args } = ctx.request.body

    if (!(fn in this.rpcMap)) {
      return this.rpcError(ctx, null, new RPCError(`RPC call ${fn}(...) not found.`, 404))
    }

    const call = this.rpcMap[fn]

    // if call.length (which is the solid args list)
    // is longer than args, we have too little to call the function.
    // if (args.length < call.length) {
    //   return this.rpcError(ctx, null, new RPCError(`RPC call ${fn}() with ${args.length} arguments does not exist.`, 400))
    // }

    try {
      const response = await call(ctx, ...args)

      ctx.body = {
        hash: this.mapHash,
        response
      }

      ctx.status = 200
    } catch (err) {
      return this.rpcError(ctx, 'RPC call errored', err, 500)
    }
  }

  rpcError (ctx: Context & {body: any}, msg: ?string, err: ?Error = null, code: ?number = null) {
    log.error('rpc error', { msg, err })

    ctx.body = {
      msg,
      error: true
    }

    if (err instanceof RPCError) {
      // this is one of our own errors, so we have a lot of data on this.
      ctx.status = err.code || code || 500
      ctx.body.msg = `${msg || 'RPC Error'}: ${err.message}`
    } else {
      if (msg == null && err != null) {
        ctx.body.msg = msg = err.message
      }

      // if not, just play cloudflare, say something was really weird, and move on.
      ctx.status = code || 520
      ctx.message = 'Unknown Error'
    }
  }
}
