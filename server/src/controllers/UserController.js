const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Log = require("../models/Log");

module.exports = {
  async index(req, res) {
    try {
      // Busca todos que NÃO são admin (apenas clientes)
      const users = await User.findAll({
        where: { role: "client" },
        order: [["name", "ASC"]],
      });
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar clientes" });
    }
  },

  // --- BUSCAR DADOS DO PERFIL ---
  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado" });

      user.password_hash = undefined; // Não manda a senha pro front
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar perfil" });
    }
  },

  // --- ATUALIZAR PERFIL ---
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        surname,
        email,
        password,
        zip_code,
        street,
        number,
        complement,
        district,
        city,
        state,
      } = req.body;

      const user = await User.findByPk(id);
      if (!user)
        return res.status(400).json({ error: "Usuário não encontrado" });

      // Objeto com os dados a atualizar
      const updateData = {
        name,
        surname,
        email,
        zip_code,
        street,
        number,
        complement,
        district,
        city,
        state,
      };

      // Se o usuário mandou senha nova, a gente criptografa e atualiza. Se mandou vazio, ignora.
      if (password && password.trim() !== "") {
        updateData.password_hash = await bcrypt.hash(password, 8);
      }

      await user.update(updateData);

      // Gera Log
      await Log.create({
        action: "Atualização de perfil",
        module: "Minha Conta",
        details: `Dados atualizados pelo usuário`,
        user_id: id,
      });

      // Retorna usuário atualizado (sem senha)
      user.password_hash = undefined;
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
  },
};
