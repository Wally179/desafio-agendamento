const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Log = require("../models/Log");

module.exports = {
  // --- LISTAR AGENDAMENTOS ---
  async index(req, res) {
    try {
      const { user_id } = req.params; // Vamos pegar o ID pela rota ou token

      const appointments = await Appointment.findAll({
        where: { user_id },
        include: { association: "User", attributes: ["name", "surname"] },
        order: [["date", "DESC"]], // Mais recentes primeiro
      });

      return res.json(appointments);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  },

  // --- CRIAR NOVO AGENDAMENTO ---
  async store(req, res) {
    try {
      const { user_id } = req.params;
      const { date, room } = req.body;

      // Cria o agendamento
      const appointment = await Appointment.create({
        user_id,
        date,
        room,
        status: "agendado", // Status inicial padrão
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
      return res
        .status(400)
        .json({ error: "Erro ao criar agendamento", details: error.message });
    }
  },

  // --- CANCELAR AGENDAMENTO ---
  async cancel(req, res) {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findByPk(id);

      if (!appointment) {
        return res.status(400).json({ error: "Agendamento não encontrado" });
      }

      appointment.status = "cancelado";
      await appointment.save();

      // Gera Log
      await Log.create({
        action: "Cancelamento de agendamento",
        module: "Agendamento",
        details: `Agendamento ${id} cancelado`,
        user_id: appointment.user_id,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao cancelar" });
    }
  },
};
