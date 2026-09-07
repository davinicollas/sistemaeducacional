const express = require("express");
const controller = require("../controllers/tipoDocumentoController");
const router = express.Router();
router.get("/tiposDocumentos", controller.index);
router.post("/tiposDocumentos", controller.save);
module.exports = router;
