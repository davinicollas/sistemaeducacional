const express = require("express");
const controller = require("../controllers/notificacaoController");
const router = express.Router();
router.get("/notificacoes", controller.index);
router.post("/notificacoes", controller.save);
module.exports = router;
