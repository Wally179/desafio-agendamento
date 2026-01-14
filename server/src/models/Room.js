const { Model, DataTypes } = require("sequelize");

class Room extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        start_time: DataTypes.STRING,
        end_time: DataTypes.STRING,
        slot_duration: DataTypes.INTEGER,
        active: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "rooms",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Appointment, {
      foreignKey: "room_id",
      as: "appointments",
    });
  }
}

module.exports = Room;
