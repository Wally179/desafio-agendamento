const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        email: DataTypes.STRING,
        password_hash: DataTypes.STRING,
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "client",
        },
        zip_code: DataTypes.STRING,
        street: DataTypes.STRING,
        number: DataTypes.STRING,
        complement: DataTypes.STRING,
        district: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Appointment, {
      foreignKey: "user_id",
      as: "appointments",
    });
    this.hasMany(models.Log, { foreignKey: "user_id", as: "logs" });
  }
}

module.exports = User;
