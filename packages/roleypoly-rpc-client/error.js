// @flow
import type { RPCResponse } from './index'

class RPCError extends Error {
  code: ?number
  extra: any[]
  remoteStack: ?string
  constructor (msg: string, code?: number, ...extra: any[]) {
    super(msg)
    this.code = code
    this.extra = extra
  }

  static fromResponse (body: RPCResponse, status: number) {
    const e = new RPCError(body.msg, status)
    e.remoteStack = body.trace
    return e
  }
}

module.exports = RPCError
