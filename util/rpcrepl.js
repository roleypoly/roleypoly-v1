import dotenv from 'dotenv'
import repl from 'repl'
import os from 'os'
import { addAwaitOutsideToReplServer } from 'await-outside'
import Roleypoly from '../Roleypoly'
import chokidar from 'chokidar'
import logger from '../logger'
process.env.DEBUG = false
process.env.IS_BOT = false

dotenv.config()

const log = logger(__filename)

const RP = new Roleypoly(null, null)
const reset = async (r) => {
  await RP.awaitServices()

  r.context.RP = RP

  r.context.ctx = { session: { userId: RP.ctx.discord.cfg.rootUsers.values().next().value } }
  r.context.guest = { session: {} }

  r.context.g_rpc = {}
  r.context.rpc = {}
  r.context.reload = () => {
    RP.ctx.RPC.reload()
    r.context.$RPC = RP.ctx.RPC.rpcMap
    for (let fn in r.context.$RPC) {
      r.context.g_rpc[fn] = r.context.$RPC[fn].bind(null, r.context.guest)
      r.context.rpc[fn] = r.context.$RPC[fn].bind(null, r.context.ctx)
    }
  }

  r.context.reload()
}

const motd = () => {
  console.log(`~~ Roleypoly RPC REPL.
  \`ctx\` a mocked koa context, defaulting to first root user.
  \`rpc\` maps to all rpc functions, prefilled with ctx.

  \`guest\` maps to a mock guest sessioned koa context.
  \`g_rpc\` maps to all rpc, prefilled with guest.

  \`$RPC\` maps to all rpc functions as they are.
  \`RP\` maps to the Roleypoly app. It does NOT have HTTP stuff running.
  \`reload()\` to refresh RPC functions.
  \`reset()\` to reset this REPL.
  `)
}

const start = async () => {
  if (repl.REPLServer.prototype.setupHistory == null) {
    console.log('  * History is available on node v11.10.0 and newer.\n')
  }
  const r = repl.start('> ')
  addAwaitOutsideToReplServer(r)
  r.setupHistory && r.setupHistory(os.homedir() + '/.ROLEYPOLY_RPCREPL_HISTORY', (e) => e && console.error(e))
  r.context.reset = async () => {
    await reset(r)
    motd()
    r.displayPrompt()
  }

  await r.context.reset()
  const rpcWatcher = chokidar.watch('rpc/**', { persistent: true })
  rpcWatcher.on('ready', () => {
    rpcWatcher.on('all', (_, path) => {
      if (r.context.reload) r.context.reload()
      log.info('reloaded RPCs')
      r.displayPrompt()
    })
  })
}

try {
  start().catch(e => console.error(e))
} catch (e) {
  console.error(e)
}
