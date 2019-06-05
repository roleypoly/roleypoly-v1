import chalk from 'chalk'

export class Logger {
  debugOn: boolean
  name: string
  quietSql: boolean

  constructor (name: string, debugOverride: boolean = false) {
    this.name = name
    this.debugOn = (process.env.DEBUG === 'true' || process.env.DEBUG === '*') || debugOverride
    this.quietSql = (process.env.DEBUG_SQL !== 'true')
  }

  fatal (text: string, ...data: any) {
    this.error(text, data)

    if (typeof data[data.length - 1] === 'number') {
      process.exit(data[data.length - 1])
    } else {
      process.exit(1)
    }
  }

  error (text: string, ...data: any) {
    console.error(chalk.red.bold(`ERR    ${this.name}:`) + `\n    ${text}`, data)
  }

  warn (text: string, ...data: any) {
    console.warn(chalk.yellow.bold(`WARN   ${this.name}:`) + `\n    ${text}`, data)
  }

  notice (text: string, ...data: any) {
    console.log(chalk.cyan.bold(`NOTICE ${this.name}:`) + `\n    ${text}`, data)
  }

  info (text: string, ...data: any) {
    console.info(chalk.blue.bold(`INFO   ${this.name}:`) + `\n    ${text}`, data)
  }

  bot (text: string, ...data: any) {
    console.log(chalk.yellowBright.bold(`BOT CMD:`) + `\n    ${text}`, data)
  }

  deprecated (text: string, ...data: any) {
    console.warn(chalk.yellowBright(`DEPRECATED ${this.name}:`) + `\n    ${text}`, data)
    console.trace()
  }

  request (text: string, ...data: any) {
    console.info(chalk.green.bold(`HTTP   ${this.name}:`) + `\n    ${text}`)
  }

  debug (text: string, ...data: any) {
    if (this.debugOn) {
      console.log(chalk.gray.bold(`DEBUG  ${this.name}:`) + `\n    ${text}`, data)
    }
  }

  sql (logger: Logger, ...data: any) {
    if (logger.debugOn && !logger.quietSql) {
      console.log(chalk.bold('DEBUG SQL:\n    '), data)
    }
  }
}

export default (pathname: string) => {
  const name = pathname.replace(__dirname, '').replace('.js', '')
  return new Logger(name)
}
