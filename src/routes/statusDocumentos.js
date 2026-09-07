const express = require("express");
const controller = require("../controllers/statusDocumentoController");
const router = express.Router();
router.get("/statusDocumentos", controller.index);
router.post("/statusDocumentos", controller.save);
module.exports = router;
