const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Log = require("../models/Log");

module.exports = {
  async register(req, res) {
    try {
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

      const userExists = await User.findOne({ where: { email } });
      if (userExists)
        return res.status(400).json({ error: "E-mail já cadastrado." });

      const password_hash = await bcrypt.hash(password, 8);

      const user = await User.create({
        name,
        surname,
        email,
        password_hash,
        zip_code,
        street,
        number,
        complement,
        district,
        city,
        state,
      });

      await Log.create({
        action: "Cadastro",
        module: "Minha Conta",
        details: `Usuário ${email} cadastrado com sucesso.`,
        user_id: user.id,
      });

      user.password_hash = undefined;

      return res.status(201).json(user);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Falha no cadastro", details: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(400).json({ error: "Usuário não encontrado." });

      const checkPassword = await bcrypt.compare(password, user.password_hash);
      if (!checkPassword)
        return res.status(401).json({ error: "Senha incorreta." });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      await Log.create({
        action: "Login",
        module: "Autenticação",
        user_id: user.id,
      });

      user.password_hash = undefined;

      return res.json({ user, token });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro no login", details: error.message });
    }
  },
};
