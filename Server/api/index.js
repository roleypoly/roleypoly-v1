const log = new (require('../logger'))('api/index');
const glob = require('glob');

const PROD = process.env.NODE_ENV === 'production';

module.exports = async (router, ctx) => {
  const apis = glob.sync(`./api/**/!(index).js`);
  log.debug('found apis', apis);

  for (let a of apis) {
    if (a.endsWith('_test.js') && PROD) {
      log.debug(`skipping ${a}`);
      continue;
    }
    log.debug(`mounting ${a}`);
    try {
      require(a.replace('api/', ''))(router, ctx);
    } catch (e) {
      log.error(`couldn't mount ${a}`, e);
    }
  }
};
