// @flow
import logger from '../logger'
import glob from 'glob'
import path from 'path'
import { type AppContext } from '../Roleypoly'

const log = logger(__filename)
const PROD: boolean = process.env.NODE_ENV === 'production'

export default (ctx: AppContext, forceClear: ?boolean = false): {
  [rpc: string]: Function
} => {
  let map = {}
  const apis = glob.sync(`./rpc/**/!(index).js`)
  log.debug('found rpcs', apis)

  for (let a of apis) {
    const filename = path.basename(a)
    const dirname = path.dirname(a)

    // internal stuff
    if (filename.startsWith('_')) {
      log.debug(`skipping ${a}`)
      continue
    }

    if (dirname === 'client') {
      log.debug(`skipping ${a}`)
      continue
    }

    // testing only
    if (filename.endsWith('_test.js') && PROD) {
      log.debug(`skipping ${a}`)
      continue
    }

    log.debug(`mounting ${a}`)
    try {
      const pathname = a.replace('rpc/', '')

      delete require.cache[require.resolve(pathname)]

      const r = require(pathname)
      let o = r
      if (o.default) {
        o = r.default
      }

      map = {
        ...map,
        ...o(ctx)
      }
    } catch (e) {
      log.error(`couldn't mount ${a}`, e)
    }
  }

  return map
}