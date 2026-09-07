const express = require("express");
const controller = require("../controllers/configuracaoNotasController");
const router = express.Router();
router.get("/configuracao_notas", controller.index);
router.post("/configuracao_notas", controller.save);
module.exports = router;
