require('dotenv').config({ quiet: true })
const withTypescript = require('@zeit/next-typescript')
module.exports = withTypescript({
  publicRuntimeConfig: {
    BOT_HANDLE: process.env.BOT_HANDLE
  },
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  }
})
