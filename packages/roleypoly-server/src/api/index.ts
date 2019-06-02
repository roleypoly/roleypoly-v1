import glob from 'glob'
import { Router, AppContext } from '../Roleypoly'
import logger from '../logger'
const log = logger(__filename)

const PROD = process.env.NODE_ENV === 'production'

export default async (router: Router, ctx: AppContext, { forceClear }: { forceClear: boolean } = { forceClear: false }) => {
  const apis = glob.sync(`${__dirname}/**/!(index).js`).map(v => v.replace(__dirname, '.'))
  log.debug('found apis', apis)

  for (let a of apis) {
    if (a.endsWith('_test.js') && PROD) {
      log.debug(`skipping ${a}`)
      continue
    }
    log.debug(`mounting ${a}`)
    try {
      if (forceClear) {
        delete require.cache[require.resolve(a)]
      }
      require(a).default(router, ctx)
    } catch (e) {
      log.error(`couldn't mount ${a}`, e)
    }
  }
}
