const express = require("express");
const controller = require("../controllers/disciplinaController");
const router = express.Router();
router.get("/disciplinas", controller.index);
router.post("/disciplinas/excluir/:id", controller.remove);
router.post("/disciplinas", controller.save);
module.exports = router;
