// @flow
import logger from '../logger'
import glob from 'glob'
import path from 'path'
import type Sequelize, { Model } from 'sequelize'

const log = logger(__filename)

export type Models = {
  [modelName: string]: Model<any> & {
    __associations: (models: Models) => void,
    __instanceMethods: (model: Model<any>) => void,
  }
}

export default (sql: Sequelize): Models => {
  const models: Models = {}
  const modelFiles = glob.sync('./models/**/!(index).js')
  log.debug('found models', modelFiles)

  modelFiles.forEach((v) => {
    let name = path.basename(v).replace('.js', '')
    if (v === './models/index.js') {
      log.debug('index.js hit, skipped')
      return
    }
    try {
      log.debug('importing..', v.replace('models/', ''))
      let model = sql.import(v.replace('models/', ''))
      models[name] = model
    } catch (err) {
      log.fatal('error importing model ' + v, err)
      process.exit(-1)
    }
  })

  Object.keys(models).forEach((v) => {
    if (models[v].hasOwnProperty('__associations')) {
      models[v].__associations(models)
    }
    if (models[v].hasOwnProperty('__instanceMethods')) {
      models[v].__instanceMethods(models[v])
    }
  })

  return models
}
