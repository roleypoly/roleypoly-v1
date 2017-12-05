const chalk = require('chalk')
// const { debug } = require('yargs').argv
// process.env.DEBUG = process.env.DEBUG || debug
// logger template//
// const log = new (require('../logger'))('server/thing')

class Logger {
  constructor (name, debugOverride = false) {
    this.name = name
    this.debugOn = (process.env.DEBUG === 'true' || process.env.DEBUG === '*') || debugOverride
  }

  fatal (text, ...data) {
    this.error(text, data)

    if (typeof data[data.length - 1] === 'number') {
      process.exit(data[data.length - 1])
    }

    throw text
  }

  error (text, ...data) {
    console.error(chalk.red.bold(`ERR    ${this.name}:`) + `\n    ${text}`, data)
  }

  warn (text, ...data) {
    console.warn(chalk.yellow.bold(`WARN   ${this.name}:`) + `\n    ${text}`, data)
  }

  notice (text, ...data) {
    console.log(chalk.cyan.bold(`NOTICE ${this.name}:`) + `\n    ${text}`, data)
  }

  info (text, ...data) {
    console.info(chalk.blue.bold(`INFO   ${this.name}:`) + `\n    ${text}`, data)
  }

  request (text, ...data) {
    console.info(chalk.green.bold(`HTTP   ${this.name}:`) + `\n    ${text}`)
  }

  debug (text, ...data) {
    if (this.debugOn) {
      console.log(chalk.gray.bold(`DEBUG  ${this.name}:`) + `\n    ${text}`, data)
    }
  }

  sql (logger, ...data) {
    if (logger.debugOn) {
      console.log(chalk.bold('DEBUG SQL:\n    '), data)
    }
  }
}

module.exports = Logger
