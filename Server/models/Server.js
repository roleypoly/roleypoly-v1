module.exports = (sql, DataTypes) => {
  return sql.define('server', {
    id: {
      // discord snowflake
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    categories: {
      type: DataTypes.JSON,
    },
    message: {
      type: DataTypes.TEXT,
    },
  });
};
