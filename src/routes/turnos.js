const express = require("express");
const controller = require("../controllers/turnoController");

const router = express.Router();
router.get("/turnos", controller.index);
router.post("/turnos/excluir/:id", controller.remove);
router.post("/turnos", controller.save);

module.exports = router;
