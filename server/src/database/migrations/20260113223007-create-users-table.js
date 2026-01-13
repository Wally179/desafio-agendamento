"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Aqui está o campo novo
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "client",
      },
      // Dados de Endereço
      zip_code: { type: Sequelize.STRING },
      street: { type: Sequelize.STRING },
      number: { type: Sequelize.STRING },
      complement: { type: Sequelize.STRING },
      district: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      // Datas de controle (obrigatório no Sequelize)
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  },
};
