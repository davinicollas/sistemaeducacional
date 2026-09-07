const express = require("express");
const controller = require("../controllers/professorController");
const router = express.Router();
router.get("/professores", controller.index);
router.post("/professores/excluir/:id", controller.remove);
router.post("/professores", controller.save);
router.post("/professores-exportar-excel", controller.exportExcel);
router.post(
  "/professores-importar-excel",
  controller.upload.single("arquivo"),
  controller.importExcel,
);
module.exports = router;
