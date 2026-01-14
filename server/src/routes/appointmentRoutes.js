const express = require("express");
const AppointmentController = require("../controllers/AppointmentController");

const router = express.Router();

router.get("/", AppointmentController.indexAll);

router.get("/:user_id", AppointmentController.index);

router.post("/:user_id", AppointmentController.store);

router.put("/:id", AppointmentController.update);

module.exports = router;
