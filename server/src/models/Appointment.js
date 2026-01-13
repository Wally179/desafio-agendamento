const { Model, DataTypes } = require("sequelize");

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: DataTypes.DATE,
        room: DataTypes.STRING,
        status: {
          type: DataTypes.STRING,
          defaultValue: "pending",
        },
      },
      {
        sequelize,
        tableName: "appointments",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

module.exports = Appointment;
