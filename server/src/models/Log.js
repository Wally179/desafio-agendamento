const { Model, DataTypes } = require("sequelize");

class Log extends Model {
  static init(sequelize) {
    super.init(
      {
        action: DataTypes.STRING,
        module: DataTypes.STRING,
        details: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: "logs",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

module.exports = Log;
