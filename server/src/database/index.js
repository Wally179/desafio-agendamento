const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Log = require("../models/Log");
const Room = require("../models/Room");

const connection = new Sequelize(dbConfig);

User.init(connection);
Appointment.init(connection);
Log.init(connection);
Room.init(connection);

User.associate(connection.models);
Appointment.associate(connection.models);
Log.associate(connection.models);
Room.associate(connection.models);

module.exports = connection;
