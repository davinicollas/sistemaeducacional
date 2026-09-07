const express = require("express");
const controller = require("../controllers/estadoController");
const router = express.Router();
router.get("/estados", controller.index);
router.post("/estados", controller.save);
router.post("/estados/excluir/:id", controller.remove);
module.exports = router;
