const express = require("express");
const controller = require("../controllers/turmaController");
const requirePermission = require("../middleware/permission");

const router = express.Router();
router.get(
  "/turmas",
  requirePermission("turmas", "visualizar"),
  controller.index,
);
router.get(
  "/turmas/:id",
  requirePermission("turmas", "visualizar"),
  controller.detail,
);
router.post(
  "/turmas/:id/alunos",
  requirePermission("turmas", "editar"),
  controller.addAluno,
);
router.post(
  "/turmas/:id/alunos/:idAluno/remover",
  requirePermission("turmas", "editar"),
  controller.removeAluno,
);
router.post(
  "/turmas/:id/professores",
  requirePermission("turmas", "editar"),
  controller.addProfessor,
);
router.post(
  "/turmas/:id/professores/:idProfessor/remover",
  requirePermission("turmas", "editar"),
  controller.removeProfessor,
);
router.post(
  "/turmas/excluir/:id",
  requirePermission("turmas", "excluir"),
  controller.remove,
);
router.post("/turmas", requirePermission("turmas", "inserir"), controller.save);
router.post(
  "/turmas-exportar-excel",
  requirePermission("turmas", "visualizar"),
  controller.exportExcel,
);
router.post(
  "/turmas-importar-excel",
  requirePermission("turmas", "inserir"),
  controller.upload.single("arquivo"),
  controller.importExcel,
);

module.exports = router;
