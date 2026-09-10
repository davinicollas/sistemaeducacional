const express = require("express");
const controller = require("../controllers/turmaController");

const router = express.Router();
router.get("/turmas", controller.index);
router.get("/turmas/:id", controller.detail);
router.post("/turmas/:id/alunos", controller.addAluno);
router.post("/turmas/:id/alunos/:idAluno/remover", controller.removeAluno);
router.post("/turmas/:id/professores", controller.addProfessor);
router.post(
  "/turmas/:id/professores/:idProfessor/remover",
  controller.removeProfessor,
);
router.post("/turmas/excluir/:id", controller.remove);
router.post("/turmas", controller.save);
router.post("/turmas-exportar-excel", controller.exportExcel);
router.post(
  "/turmas-importar-excel",
  controller.upload.single("arquivo"),
  controller.importExcel,
);

module.exports = router;
