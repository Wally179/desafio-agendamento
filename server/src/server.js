require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./database");

const appointmentRoutes = require("./routes/appointmentRoutes");
const logRoutes = require("./routes/logRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/logs", logRoutes);
app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.send("API de Agendamento rodando!");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
