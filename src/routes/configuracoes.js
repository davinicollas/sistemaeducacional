const express = require("express");
const controller = require("../controllers/configuracaoController");
const router = express.Router();
router.get("/configuracoes", controller.index);
router.post("/configuracoes", controller.save);
module.exports = router;
