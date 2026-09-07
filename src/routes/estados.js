const express = require("express");
const controller = require("../controllers/estadoController");
const router = express.Router();
router.get("/estados", controller.index);
router.post("/estados", controller.save);
module.exports = router;
