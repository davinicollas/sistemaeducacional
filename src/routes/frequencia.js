const express = require("express");
const controller = require("../controllers/frequenciaController");

const router = express.Router();
router.get("/frequencia", controller.index);
router.get("/frequencia/turmas", controller.turmasPorAno);
router.get("/frequencia/alunos", controller.alunosPorTurma);
router.get("/frequencia/registro", controller.registro);
router.post("/frequencia", controller.salvar);
router.get("/frequencia/:id/historico", controller.historico);

module.exports = router;
