require("dotenv").config();
const express = require("express");
const cors = require("cors");

// --- CORREÇÃO 1: Importa a conexão (index.js) e não as configs ---
// Isso vai inicializar os Models (User, Appointment, Log) automaticamente.
require("./database");

// Importação das suas rotas (Mantendo o que você já tinha)
const appointmentRoutes = require("./routes/appointmentRoutes");
const logRoutes = require("./routes/logRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Definição das rotass
app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/logs", logRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API de Agendamento rodando!");
});

// --- CORREÇÃO 2: Removemos o db.sync() ---
// Como já rodamos as migrations, o banco já está pronto.
// Não precisamos forçar sincronização aqui.
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
