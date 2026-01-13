const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Certifique-se que este arquivo exporta a conexão (new Sequelize)
const User = require("./User");

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    module: {
      type: DataTypes.STRING,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "logs",
  }
);

// Associações
User.hasMany(Log, { foreignKey: "user_id" });
Log.belongsTo(User, { foreignKey: "user_id" });

module.exports = Log;
