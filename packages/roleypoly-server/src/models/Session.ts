import Sequelize from 'sequelize'

export default (sequelize: Sequelize.Sequelize, DataTypes: typeof Sequelize.DataTypes) => {
  return sequelize.define('session', {
    id: { type: DataTypes.TEXT, primaryKey: true },
    maxAge: DataTypes.BIGINT,
    data: DataTypes.JSONB
  })
}
