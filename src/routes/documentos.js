const express = require("express");
const controller = require("../controllers/documentoController");
const requirePermission = require("../middleware/permission");
const router = express.Router();
router.get(
  "/documentos",
  requirePermission("documentos", "visualizar"),
  controller.index,
);
router.post(
  "/documentos",
  requirePermission("documentos", "inserir"),
  controller.upload.single("arquivo"),
  controller.save,
);
router.post(
  "/documentos/:id",
  requirePermission("documentos", "editar"),
  controller.upload.single("arquivo"),
  controller.save,
);
router.post(
  "/documentos/excluir/:id",
  requirePermission("documentos", "excluir"),
  controller.remove,
);
module.exports = router;
