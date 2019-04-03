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
  const apis = glob.sync(`${__dirname}/**/!(index).js`).map(v => v.replace(__dirname, '.'))
  log.debug('found rpcs', apis)

  for (let a of apis) {
    const filename = path.basename(a)
    const dirname = path.dirname(a)

    const pathname = a
    delete require.cache[require.resolve(pathname)]

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
