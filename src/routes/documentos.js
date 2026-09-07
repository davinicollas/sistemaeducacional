const express = require("express");
const controller = require("../controllers/documentoController");
const router = express.Router();
router.get("/documentos", controller.index);
router.post(
  "/documentos",
  controller.upload.single("arquivo"),
  controller.save,
);
router.post(
  "/documentos/:id",
  controller.upload.single("arquivo"),
  controller.save,
);
router.post("/documentos/excluir/:id", controller.remove);
module.exports = router;
