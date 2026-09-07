const express = require("express");
const controller = require("../controllers/tipoAvaliacaoController");

const router = express.Router();
router.get("/tipos-avaliacao", controller.index);
router.post("/tipos-avaliacao/excluir/:id", controller.remove);
router.post("/tipos-avaliacao", controller.save);

module.exports = router;
