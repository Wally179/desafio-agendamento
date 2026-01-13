const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("agendado", "cancelado", "em_analise", "concluido"),
      defaultValue: "em_analise",
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Appointment, { foreignKey: "user_id" });
Appointment.belongsTo(User, { foreignKey: "user_id" });

module.exports = Appointment;
