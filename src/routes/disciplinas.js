const express = require("express");
const controller = require("../controllers/disciplinaController");
const requirePermission = require("../middleware/permission");
const router = express.Router();
router.get(
  "/disciplinas",
  requirePermission("disciplinas", "visualizar"),
  controller.index,
);
router.post(
  "/disciplinas/excluir/:id",
  requirePermission("disciplinas", "excluir"),
  controller.remove,
);
router.post(
  "/disciplinas",
  requirePermission("disciplinas", "inserir"),
  controller.save,
);
module.exports = router;
