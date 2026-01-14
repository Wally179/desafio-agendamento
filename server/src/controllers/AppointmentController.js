const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Log = require("../models/Log");
const Room = require("../models/Room");

module.exports = {
  async indexAll(req, res) {
    try {
      const appointments = await Appointment.findAll({
        include: [
          {
            association: "user",
            attributes: ["name", "surname", "email"],
          },
          {
            association: "room_details",
            attributes: ["name", "id"],
          },
        ],
        order: [["date", "DESC"]],
      });
      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar todos agendamentos" });
    }
  },

  async index(req, res) {
    try {
      const { user_id } = req.params;
      const appointments = await Appointment.findAll({
        where: { user_id },
        include: [
          {
            association: "user",
            attributes: ["name", "surname"],
          },
          {
            association: "room_details",
            attributes: ["name", "id"],
          },
        ],
        order: [["date", "DESC"]],
      });
      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  },

  async store(req, res) {
    try {
      const { user_id } = req.params;
      const { date, room_id } = req.body;

      const roomExists = await Room.findByPk(room_id);
      if (!roomExists) {
        return res
          .status(400)
          .json({ error: "Sala inválida ou não encontrada." });
      }

      const appointment = await Appointment.create({
        user_id,
        date,
        room_id,
        room: roomExists.name,
        status: "pending",
      });

      await Log.create({
        action: "Criação de agendamento",
        module: "Agendamento",
        details: `Sala "${roomExists.name}" agendada para ${date}`,
        user_id,
      });

      return res.json(appointment);
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ error: "Erro ao criar agendamento", details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const appointment = await Appointment.findByPk(id);

      if (!appointment) {
        return res.status(400).json({ error: "Agendamento não encontrado" });
      }

      appointment.status = status;
      await appointment.save();

      await Log.create({
        action: `Atualização de status: ${status}`,
        module: "Agendamento",
        details: `Agendamento ${id} alterado para ${status}`,
        user_id: appointment.user_id,
      });

      return res.json(appointment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar status" });
    }
  },
};
