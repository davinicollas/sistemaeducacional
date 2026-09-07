const express = require("express");
const controller = require("../controllers/periodoController");

const router = express.Router();
router.get("/periodos", controller.index);
router.post("/periodos/excluir/:id", controller.remove);
router.post("/periodos", controller.save);

module.exports = router;
