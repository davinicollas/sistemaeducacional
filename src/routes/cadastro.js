const express = require("express");
const controller = require("../controllers/cadastroController");
const router = express.Router();
router.get("/cadastro", controller.index);
router.post("/cadastro", controller.save);
module.exports = router;
