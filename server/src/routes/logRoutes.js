const express = require("express");
const routes = express.Router();
const LogController = require("../controllers/LogController");

routes.get("/:user_id", LogController.index);

module.exports = routes;
