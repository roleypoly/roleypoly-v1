import { Servers as ServersRPC, HTTPTransport } from '@roleypoly/rpc'
import Bento, { JSONSerializer } from '@kayteh/bento'

// const o = {
//   getCurrentUser: async (..._: any) => null,
//   getServerSlug: async (..._: any) => null,
//   checkAuthChallenge: async (..._: any) => false
// }

export const bento = new Bento()
export const transport = new HTTPTransport(
  bento,
  new JSONSerializer(),
  process.env.RPC_URL || '/api/_rpc'
)

bento.transport = transport

export const Servers = bento.client(ServersRPC.ServersClient)
