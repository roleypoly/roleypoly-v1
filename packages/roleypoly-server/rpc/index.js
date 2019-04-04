// @flow
import fnv from 'fnv-plus'
import autoloader from './_autoloader'
import RPCError from '@roleypoly/rpc-client/error'
import type Roleypoly, { Router } from '../Roleypoly'
import type { Context } from 'koa'
// import logger from '../logger'
// const log = logger(__filename)

export type RPCIncoming = {
  fn: string,
  args: any[]
}

export type RPCOutgoing = {
  hash: string,
  response: any
}

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
    ctx.addRouteHook(this.hookRoutes)
  }

  reload () {
    // actual function map
    this.rpcMap = autoloader(this.ctx.ctx)

    // hash of the map
    // used for known-reloads in the client.
    this.mapHash = fnv.hash(Object.keys(this.rpcMap)).str()

    // call map for the client.
    this.rpcCalls = Object.keys(this.rpcMap).map(fn => ({ name: fn, args: 0 }))
  }

  hookRoutes = (router: Router) => {
    // RPC call reporter.
    // this is NEVER called in prod.
    // it is used to generate errors if RPC calls don't exist or are malformed in dev.
    router.get('/api/_rpc', async (ctx: Context) => {
      ctx.body = ({
        hash: this.mapHash,
        available: this.rpcCalls
      }: any)
      ctx.status = 200
      return true
    })

    router.post('/api/_rpc', this.handleRPC)
  }

  handleRPC = async (ctx: Context) => {
    // handle an impossible situation
    if (!(ctx.request.body instanceof Object)) {
      return this.rpcError(ctx, null, new RPCError('RPC format was very incorrect.', 400))
    }

    // check if RPC exists
    const { fn, args } = (ctx.request.body: RPCIncoming)

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

  /**
   * For internally called stuff, such as from a bot shard.
   */
  async call (fn: string, ...args: any[]) {
    if (!(fn in this.rpcMap)) {
      throw new RPCError(`RPC call ${fn}(...) not found.`, 404)
    }

    const call = this.rpcMap[fn]
    return call(...args)
  }

  rpcError (ctx: Context & {body: any}, msg: ?string, err: ?Error = null, code: ?number = null) {
    // log.error('rpc error', { msg, err })

    ctx.body = {
      msg: err?.message || msg,
      error: true
    }

    ctx.status = code || 500
    if (err != null) {
      if (err instanceof RPCError || err.constructor.name === 'RPCError') {
        // $FlowFixMe
        ctx.status = err.code
      }
    }

    // if (err != null && err.constructor.name === 'RPCError') {
    //   console.log({ status: err.code })
    //   // this is one of our own errors, so we have a lot of data on this.
    //   ctx.status = err.code // || code || 500
    //   ctx.body.msg = `${err.message || msg || 'RPC Error'}`
    // } else {
    //   if (msg == null && err != null) {
    //     ctx.body.msg = err.message
    //   }

    //   // if not, just play cloudflare, say something was really weird, and move on.
    //   ctx.status = code || 520
    //   ctx.message = 'Unknown Error'
    // }
  }
}
