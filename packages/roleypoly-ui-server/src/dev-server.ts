import chokidar from 'chokidar'
import chalk from 'chalk'

export const hotReloader = (watchPath: string, callback: () => Function): Function => {
  const watcher = chokidar.watch(watchPath, { ignoreInitial: true })
  let hotMiddleware = callback()

  watcher.on('all', (_: string, file: string) => {
    delete require.cache[file]

    console.log(`[ ${chalk.red`dev-server`} ] hot reloaded, file changed:`, file)
    hotMiddleware = callback()
  })

  console.log(`[ ${chalk.red`dev-server`} ] hot reloading started.`)
  return (...args: any) => hotMiddleware(...args)
}
