"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("rooms", [
      {
        name: "Sala 01",
        start_time: "08:00",
        end_time: "18:00",
        slot_duration: 30,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sala 02",
        start_time: "08:00",
        end_time: "18:00",
        slot_duration: 30,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sala 03",
        start_time: "09:00",
        end_time: "19:00",
        slot_duration: 45,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sala 04",
        start_time: "08:00",
        end_time: "18:00",
        slot_duration: 30,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Auditório Principal",
        start_time: "08:00",
        end_time: "22:00",
        slot_duration: 60,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sala de Reunião Executiva",
        start_time: "09:00",
        end_time: "18:00",
        slot_duration: 60,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Laboratório de Inovação",
        start_time: "10:00",
        end_time: "20:00",
        slot_duration: 120,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sala de Treinamento",
        start_time: "08:00",
        end_time: "17:00",
        slot_duration: 60,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Espaço Brainstorming",
        start_time: "09:00",
        end_time: "19:00",
        slot_duration: 45,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sala de Videoconferência",
        start_time: "08:00",
        end_time: "18:00",
        slot_duration: 30,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("rooms", null, {});
  },
};
