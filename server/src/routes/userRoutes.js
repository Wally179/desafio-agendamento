const express = require("express");
const routes = express.Router();
const UserController = require("../controllers/UserController");

routes.get("/:id", UserController.show);
routes.put("/:id", UserController.update);

module.exports = routes;
