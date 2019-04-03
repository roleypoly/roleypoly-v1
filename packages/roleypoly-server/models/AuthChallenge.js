// @flow
import type Sequelize, { DataTypes as DT } from 'sequelize'

export default (sql: Sequelize, DataTypes: DT) => {
  return sql.define('auth_challenge', {
    userId: DataTypes.TEXT,
    issuedAt: DataTypes.DATE,
    type: DataTypes.ENUM('dm', 'other'),
    human: { type: DataTypes.TEXT, unique: true },
    magic: { type: DataTypes.TEXT, unique: true }
  }, {
    indexes: [ { fields: ['userId'] } ]
  })
}
