const Log = require("../models/Log");

module.exports = {
  async index(req, res) {
    try {
      const { user_id } = req.params;

      const logs = await Log.findAll({
        where: { user_id },
        // CORREÇÃO: O nome padrão do Sequelize é 'createdAt', não 'created_at'
        order: [["createdAt", "DESC"]],
      });

      return res.json(logs);
    } catch (error) {
      // Adicionei este log para vermos o erro real no terminal se acontecer de novo
      console.error("Erro ao buscar logs:", error);
      return res.status(500).json({ error: "Erro ao buscar logs" });
    }
  },
};
