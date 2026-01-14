const express = require("express");
const LogController = require("../controllers/LogController");

const router = express.Router();

router.get("/", LogController.indexAll);

router.get("/:user_id", LogController.index);

module.exports = router;
