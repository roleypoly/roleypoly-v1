// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
import RPCError from './_error'

// import logger from '../logger'
// const log = logger(__filename)

const PermissionError = new RPCError('User does not have permission to call this RPC.', 403)

// export const bot = (fn: Function) => (secret: string, ...args: any[]) => {
//   if (secret !== process.env.SHARED_SECRET) {
//     log.error('unauthenticated bot request', { secret })
//     return { err: 'unauthenticated' }
//   }

//   return fn(...args)
// }

export const root = ($: AppContext, fn: Function) => (ctx: Context, ...args: any[]) => {
  if ($.discord.isRoot(ctx.session.userId)) {
    return fn(ctx, ...args)
  }

  throw PermissionError
}

export const manager = ($: AppContext, fn: Function) => (ctx: Context, server: string, ...args: any[]) => {
  if ($.discord.canManageRoles(server, ctx.session.userId)) {
    return fn(ctx, server, ...args)
  }

  throw PermissionError
}

export const member = ($: AppContext, fn: Function) => (ctx: Context, server: string, ...args: any[]) => {
  if ($.discord.isMember(server, ctx.session.userId)) {
    return fn(ctx, server, ...args)
  }

  throw PermissionError
}
