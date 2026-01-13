const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Log = require("../models/Log");

module.exports = {
  // --- LISTAR AGENDAMENTOS ---
  async index(req, res) {
    try {
      const { user_id } = req.params;

      const appointments = await Appointment.findAll({
        where: { user_id },
        include: { association: "user", attributes: ["name", "surname"] },
        order: [["date", "DESC"]],
      });

      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  },

  // --- CRIAR NOVO AGENDAMENTO ---
  async store(req, res) {
    try {
      // CORREÇÃO: Agora pegamos o user_id dos PARAMS (URL) e não do body
      const { user_id } = req.params;
      const { date, room } = req.body;

      // Cria o agendamento
      const appointment = await Appointment.create({
        user_id,
        date,
        room: room || "012",
        status: "pending",
      });

      // Gera Log
      await Log.create({
        action: "Criação de agendamento",
        module: "Agendamento",
        details: `Sala ${room} agendada para ${date}`,
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

  // --- ATUALIZAR STATUS (APROVAR OU CANCELAR) ---
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

      // Gera Log
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
