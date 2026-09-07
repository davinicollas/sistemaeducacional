const express = require("express");
const controller = require("../controllers/salaController");

const router = express.Router();
router.get("/salas", controller.index);
router.post("/salas/excluir/:id", controller.remove);
router.post("/salas", controller.save);

module.exports = router;
