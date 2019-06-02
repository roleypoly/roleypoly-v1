// @flow
// import RPCClient from '@roleypoly/rpc-client'

// const client = new RPCClient({ forceDev: false })

// export default client.rpc
// export const withCookies = (ctx: any) => {
//   if (ctx.req != null) {
//     return client.withCookies(ctx.req.headers.cookie)
//   } else {
//     return client.rpc
//   }
// }
const o = {
  getCurrentUser: async (..._: any) => null,
  getServerSlug: async (..._: any) => null,
  checkAuthChallenge: async (..._: any) => false
}

export default o
export function withCookies () {
  return o
}
