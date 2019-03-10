class RPCError extends Error {
  constructor (msg, code, ...extra) {
    super(msg)
    this.code = code
    this.extra = extra
  }

  static fromResponse (body, status) {
    const e = new RPCError(body.msg, status)
    e.remoteStack = body.trace
    return e
  }
}

module.exports = RPCError
