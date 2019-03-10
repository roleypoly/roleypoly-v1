// @flow
import RPCClient from '../rpc'

const client = new RPCClient({ forceDev: false })

export default client.rpc
export const withCookies = (ctx: any) => {
  if (ctx.req != null) {
    return client.withCookies(ctx.req.headers.cookie)
  } else {
    return client.rpc
  }
}
