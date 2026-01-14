const Log = require("../models/Log");
const User = require("../models/User");

module.exports = {
  async indexAll(req, res) {
    try {
      const logs = await Log.findAll({
        include: {
          association: "user",
          attributes: ["name", "surname", "email", "role"],
        },
        order: [["createdAt", "DESC"]],
      });
      return res.json(logs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar todos os logs" });
    }
  },

  async index(req, res) {
    try {
      const { user_id } = req.params;
      const logs = await Log.findAll({
        where: { user_id },
        order: [["createdAt", "DESC"]],
      });
      return res.json(logs);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return res.status(500).json({ error: "Erro ao buscar logs" });
    }
  },
};
