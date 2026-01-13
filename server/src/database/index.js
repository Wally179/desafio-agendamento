const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database"); // Importa as configs do arquivo acima

const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Log = require("../models/Log");

const connection = new Sequelize(dbConfig);

User.init(connection);
Appointment.init(connection);
Log.init(connection);

User.associate(connection.models);
Appointment.associate(connection.models);
Log.associate(connection.models);

module.exports = connection;
