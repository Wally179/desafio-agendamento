const express = require("express");
const routes = express.Router();
const AppointmentController = require("../controllers/AppointmentController");

// Precisamos do ID do usuário para listar e criar
routes.get("/:user_id", AppointmentController.index);
routes.post("/:user_id", AppointmentController.store);
routes.patch("/:id/cancel", AppointmentController.cancel);

module.exports = routes;
