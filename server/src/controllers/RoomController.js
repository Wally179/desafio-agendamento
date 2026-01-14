const Room = require("../models/Room");

module.exports = {
  // GET /rooms - Lista para preencher o Select
  async index(req, res) {
    try {
      const rooms = await Room.findAll({
        where: { active: true },
        order: [["name", "ASC"]],
      });
      return res.json(rooms);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar salas" });
    }
  },

  // POST /rooms - Criação via Modal
  async store(req, res) {
    const { name, start_time, end_time, slot_duration } = req.body;

    try {
      const room = await Room.create({
        name,
        start_time,
        end_time,
        slot_duration,
      });

      return res.json(room);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar sala" });
    }
  },

  // PUT /rooms/:id - Atualização via Modal
  async update(req, res) {
    const { id } = req.params;
    const { start_time, end_time, slot_duration } = req.body;

    try {
      const room = await Room.findByPk(id);
      if (!room) {
        return res.status(400).json({ error: "Sala não encontrada" });
      }

      await room.update({ start_time, end_time, slot_duration });

      return res.json(room);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar sala" });
    }
  },
};
