const express = require("express");
const controller = require("../controllers/alunoController");
const router = express.Router();
router.get("/alunos", controller.index);
router.post("/alunos/excluir/:id", controller.remove);
router.post("/alunos", controller.save);
router.post("/alunos-exportar-excel", controller.exportExcel);
router.post(
  "/aluno-importar-excel",
  controller.upload.single("arquivo"),
  controller.importExcel,
);
module.exports = router;
