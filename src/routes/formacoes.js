const express = require("express");
const controller = require("../controllers/formacaoController");
const router = express.Router();
router.get("/formacoes", controller.index);
router.post("/formacoes", controller.save);
module.exports = router;
