const express = require("express");
const controller = require("../controllers/professorController");
const requirePermission = require("../middleware/permission");
const router = express.Router();
router.get(
  "/professores",
  requirePermission("professores", "visualizar"),
  controller.index,
);
router.post(
  "/professores/excluir/:id",
  requirePermission("professores", "excluir"),
  controller.remove,
);
router.post(
  "/professores",
  requirePermission("professores", "inserir"),
  controller.save,
);
router.post(
  "/professores/:id/senha",
  requirePermission("professores", "editar"),
  controller.setSenha,
);
router.post(
  "/professores-exportar-excel",
  requirePermission("professores", "visualizar"),
  controller.exportExcel,
);
router.post(
  "/professores-importar-excel",
  requirePermission("professores", "inserir"),
  controller.upload.single("arquivo"),
  controller.importExcel,
);
module.exports = router;
