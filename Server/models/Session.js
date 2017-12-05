module.exports = (sequelize, DataTypes) => {
  return sequelize.define('session', {
    id: { type: DataTypes.TEXT, primaryKey: true },
    maxAge: DataTypes.BIGINT,
    data: DataTypes.JSONB
  })
}
