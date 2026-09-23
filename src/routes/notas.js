const express = require("express");
const controller = require("../controllers/notasController");

const router = express.Router();

router.get("/notas", controller.index);
router.get("/notas/dados", controller.dados);
router.get("/notas/alunos", controller.alunosPorTurma);
router.get("/notas/registro", controller.registro);
router.get("/notas/:id/historico", controller.historico);
router.post("/notas", controller.salvar);
router.put("/notas/:id", controller.atualizar);
router.delete("/notas/:id", controller.deletar);

module.exports = router;
