import logger from '../logger'
import glob from 'glob'
import path from 'path'
import { Sequelize, Model } from 'sequelize'

const log = logger(__filename)

export type Models = {
  [modelName: string]: typeof Model & Partial<{
    __associations: (models: Models) => void
    __instanceMethods: (model: typeof Model) => void
  }>
}

export default (sql: Sequelize): Models => {
  const models: Models = {}
  const modelFiles = glob.sync(`${__dirname}/**/!(index).js`).map(v => v.replace(__dirname, '.'))
  log.debug('found models', modelFiles)

  for (const v of modelFiles) {
    let name = path.basename(v).replace('.js', '')
    if (v === `./index.js`) {
      log.debug('index.js hit, skipped')
      continue
    }

    try {
      log.debug('importing..', v)
      let model = sql.import(v)
      models[name] = model
    } catch (err) {
      log.fatal('error importing model ' + v, err)
      process.exit(-1)
    }
  }

  for (const model of Object.values(models)) {
    if (model.__associations !== undefined) {
      model.__associations(models)
    }

    if (model.__instanceMethods !== undefined) {
      model.__instanceMethods(model)
    }
  }

  return models
}
