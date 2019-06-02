import Sequelize from 'sequelize'

export default (sql: Sequelize.Sequelize, DataTypes: typeof Sequelize.DataTypes) => {
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
