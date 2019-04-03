// @flow
import logger from '../logger'
import glob from 'glob'

import type { Router, AppContext } from '../Roleypoly'

const log = logger(__filename)

const PROD = process.env.NODE_ENV === 'production'

export default async (router: Router, ctx: AppContext, { forceClear = false }: { forceClear: boolean } = {}) => {
  const apis = glob.sync(`./api/**/!(index).js`)
  log.debug('found apis', apis)

  for (let a of apis) {
    if (a.endsWith('_test.js') && PROD) {
      log.debug(`skipping ${a}`)
      continue
    }
    log.debug(`mounting ${a}`)
    try {
      const pathname = a.replace('api/', '')
      if (forceClear) {
        delete require.cache[require.resolve(pathname)]
      }
      // $FlowFixMe this isn't an important error. potentially dangerous, but irrelevant.
      require(pathname).default(router, ctx)
    } catch (e) {
      log.error(`couldn't mount ${a}`, e)
    }
  }
}
