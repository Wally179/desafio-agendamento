const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const appointmentRoutes = require("./routes/appointmentRoutes");
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Log = require("./models/Log");
const logRoutes = require("./routes/logRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/logs", logRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API de Agendamento rodando!");
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  try {
    await db.sync({ force: false });
    console.log("✅ Banco sincronizado!");
  } catch (error) {
    console.error("❌ Erro:", error);
  }
});
