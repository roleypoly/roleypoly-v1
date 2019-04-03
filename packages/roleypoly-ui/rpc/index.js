// @flow
import superagent from 'superagent'
import RPCError from '../../rpc/_error'

export type RPCResponse = {
  response?: mixed,
  hash?: string,

  // error stuff
  error?: boolean,
  msg?: string,
  trace?: string
}

export type RPCRequest = {
  fn: string,
  args: mixed[]
}

export default class RPCClient {
  dev: boolean = false
  baseUrl: string
  firstKnownHash: string
  recentHash: string
  cookieHeader: string

  rpc: {
    [fn: string]: (...args: any[]) => Promise<any>
  } = {}

  __rpcAvailable: Array<{
    name: string,
    args: number
  }> = []

  constructor ({ forceDev, baseUrl = '/api/_rpc' }: { forceDev?: boolean, baseUrl?: string } = {}) {
    this.baseUrl = (process.env.APP_URL || '') + baseUrl

    if (forceDev != null) {
      this.dev = forceDev
    } else {
      this.dev = process.env.NODE_ENV === 'development'
    }

    this.rpc = new Proxy({}, {
      get: this.__rpcCall,
      has: this.__checkCall,
      ownKeys: this.__listCalls,
      delete: () => {}
    })

    if (this.dev) {
      this.updateCalls()
    }
  }

  withCookies = (h: string) => {
    this.cookieHeader = h
    return this.rpc
  }

  async updateCalls () {
    // this is for development only. doing in prod is probably dumb.
    const rsp = await superagent.get(this.baseUrl)
    if (rsp.status !== 200) {
      console.error(rsp)
      return
    }

    const { hash, available } = rsp.body

    this.__rpcAvailable = available
    if (this.firstKnownHash == null) {
      this.firstKnownHash = hash
    }

    this.recentHash = hash

    // just kinda prefill. none of these get called anyway.
    // and don't matter in prod either.
    for (let { name } of available) {
      this.rpc[name] = async () => {}
    }
  }

  async call (fn: string, ...args: any[]): mixed {
    const req: RPCRequest = { fn, args }
    const rq = superagent.post(this.baseUrl)
    if (this.cookieHeader != null) {
      rq.cookies = this.cookieHeader
    }
    const rsp = await rq.send(req).ok(() => true)
    const body: RPCResponse = rsp.body
    // console.log(body)
    if (body.error === true) {
      console.error(body)
      throw RPCError.fromResponse(body, rsp.status)
    }

    if (body.hash != null) {
      if (this.firstKnownHash == null) {
        this.firstKnownHash = body.hash
      }

      this.recentHash = body.hash

      if (this.firstKnownHash !== this.recentHash) {
        this.updateCalls()
      }
    }

    return body.response
  }

  // PROXY HANDLERS
  __rpcCall = (_: {}, fn: string) => this.call.bind(this, fn)
  __checkCall = (_: {}, fn: string) => this.dev ? this.__listCalls(_).includes(fn) : true
  __listCalls = (_: {}): string[] => this.__rpcAvailable.map(x => x.name)
}
