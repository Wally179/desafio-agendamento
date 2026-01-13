const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Log = require("../models/Log");

const connection = new Sequelize(dbConfig);

// Inicializa os modelos
User.init(connection);
Appointment.init(connection);
Log.init(connection);

// Inicializa as associações
User.associate(connection.models);
Appointment.associate(connection.models);
Log.associate(connection.models);

module.exports = connection;
