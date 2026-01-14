const express = require("express");
const RoomController = require("../controllers/RoomController");

const router = express.Router();

router.get("/", RoomController.index);
router.post("/", RoomController.store);
router.put("/:id", RoomController.update);

module.exports = router;
