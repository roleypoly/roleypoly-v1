const next = require('next')

const connector = ({ dev }) => {
  return next({ dev })
}

module.exports = connector
