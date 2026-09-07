const express = require("express");
const controller = require("../controllers/calendarioController");
const router = express.Router();
router.get("/calendario", controller.index);
router.post("/calendario", controller.save);
router.post("/calendario/excluir/:id", controller.remove);
module.exports = router;
