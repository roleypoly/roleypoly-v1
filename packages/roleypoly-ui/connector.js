const next = require('next')

const connector = ({ dev }) => {
  return next({ dev, dir: __dirname })
}

module.exports = connector
