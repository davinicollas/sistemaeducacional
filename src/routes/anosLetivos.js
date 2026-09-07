const express = require("express");
const controller = require("../controllers/anoLetivoController");

const router = express.Router();
router.get("/anos-letivos", controller.index);
router.post("/anos-letivos/excluir/:id", controller.remove);
router.post("/anos-letivos", controller.save);

module.exports = router;
