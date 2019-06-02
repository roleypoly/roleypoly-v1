// @flow
import Sequelize from 'sequelize'

export type Category = {
  hidden: boolean,
  name: string,
  roles: string[],
  _roles?: any,
  type: 'single' | 'multi' | string
}

export type ServerModel = {
  id: string,
  categories: {
    [uuid: string]: Category
  },
  message: string
}

export default (sql: Sequelize.Sequelize, DataTypes: typeof Sequelize.DataTypes) => {
  return sql.define('server', {
    id: { // discord snowflake
      type: DataTypes.TEXT,
      primaryKey: true
    },
    categories: {
      type: DataTypes.JSON
    },
    message: {
      type: DataTypes.TEXT
    }
  })
}
