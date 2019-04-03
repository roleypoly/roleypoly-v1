// @flow
import { type AppContext } from '../Roleypoly'
import { type Context } from 'koa'
import RPCError from './_error'

import logger from '../logger'
const log = logger(__filename)

const PermissionError = new RPCError('User does not have permission to call this RPC.', 403)

const logFacts = (
  ctx: Context,
  extra: { [x:string]: any } = {}
) => ({
  fn: (ctx.request.body: any).fn,
  ip: ctx.ip,
  user: ctx.session.userId,
  ...extra
})

export const authed = (
  $: AppContext,
  fn: (ctx: Context, ...args: any[]) => any,
  silent: boolean = false
) => async (
  ctx: Context,
  ...args: any[]
) => {
  if (await $.auth.isLoggedIn(ctx)) {
    return fn(ctx, ...args)
  }

  if ($.config.dev) {
    log.debug('authed failed')
    throw new RPCError('User is not logged in', 403)
  }

  if (!silent) {
    log.info('RPC call authed check fail', logFacts(ctx))
  }

  throw PermissionError
}

export const root = (
  $: AppContext,
  fn: (ctx: Context, ...args: any[]) => any,
  silent: boolean = false
) => authed($, (
  ctx: Context,
  ...args: any[]
) => {
  if ($.discord.isRoot(ctx.session.userId)) {
    return fn(ctx, ...args)
  }

  if ($.config.dev) {
    log.debug('root failed')
    throw new RPCError('User is not root', 403)
  }

  if (!silent) {
    log.info('RPC call root check fail', logFacts(ctx))
  }

  throw PermissionError
})

export const manager = (
  $: AppContext,
  fn: (ctx: Context, server: string, ...args: any[]) => any,
  silent: boolean = false
) => member($, (
  ctx: Context,
  server: string,
  ...args: any[]
) => {
  if ($.discord.canManageRoles(server, ctx.session.userId)) {
    return fn(ctx, server, ...args)
  }

  if ($.config.dev) {
    log.debug('manager failed')
    throw new RPCError('User is not a role manager', 403)
  }

  if (!silent) {
    log.info('RPC call manager check fail', logFacts(ctx, { server }))
  }

  throw PermissionError
})

export const member = (
  $: AppContext,
  fn: (ctx: Context, server: string, ...args: any[]) => any,
  silent: boolean = false
) => authed($, (
  ctx: Context,
  server: string,
  ...args: any[]
) => {
  if ($.discord.isMember(server, ctx.session.userId)) {
    return fn(ctx, server, ...args)
  }

  if ($.config.dev) {
    log.debug('member failed')
    throw new RPCError('User is not a member of this server', 403)
  }

  if (!silent) {
    log.info('RPC call member check fail', logFacts(ctx, { server }))
  }

  throw PermissionError
})

export const any = (
  $: AppContext,
  fn: (ctx: Context, ...args: any[]) => any,
  silent: boolean = false
) => (...args: any) => fn(...args)

type Handler = (ctx: Context, ...args: any[]) => any
type Strategy = (
  $: AppContext,
  fn: Handler,
  silent?: boolean
) => any
type StrategyPair = [ Strategy, Handler ]

/**
 * Weird func but ok -- test that a strategy doesn't fail, and run the first that doesn't.
 */
export const decide = (
  $: AppContext,
  ...strategies: StrategyPair[]
) => async (...args: any) => {
  for (let [ strat, handler ] of strategies) {
    if (strat === null) {
      strat = any
    }

    try {
      return await strat($, handler, true)(...args)
    } catch (e) {
      continue
    }
  }

  // if we reach the end, just throw
  if ($.config.dev) {
    log.info('decide failed for', strategies.map(v => v[0].name))
  }

  throw PermissionError
}
