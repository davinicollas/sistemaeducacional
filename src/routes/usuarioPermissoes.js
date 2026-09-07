const express = require("express");
const controller = require("../controllers/usuarioPermissoesController");
const authMid = require("../middleware/auth");
const router = express.Router();
router.get("/usuariosPermissoes", authMid, controller.index);
router.post("/usuariosPermissoes", authMid, controller.save);
router.post("/usuariosPermissoes/role", authMid, controller.createRole);
router.post(
  "/usuariosPermissoes/permission",
  authMid,
  controller.createPermission,
);
module.exports = router;
