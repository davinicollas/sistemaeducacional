const express = require("express");
const controller = require("../controllers/alunoController");
const requirePermission = require("../middleware/permission");
const router = express.Router();
router.get(
  "/alunos",
  requirePermission("alunos", "visualizar"),
  controller.index,
);
router.post(
  "/alunos/excluir/:id",
  requirePermission("alunos", "excluir"),
  controller.remove,
);
router.post("/alunos", requirePermission("alunos", "inserir"), controller.save);
router.post(
  "/alunos/:id/senha",
  requirePermission("alunos", "editar"),
  controller.setSenha,
);
router.post(
  "/alunos-exportar-excel",
  requirePermission("alunos", "visualizar"),
  controller.exportExcel,
);
router.post(
  "/aluno-importar-excel",
  requirePermission("alunos", "inserir"),
  controller.upload.single("arquivo"),
  controller.importExcel,
);
module.exports = router;
