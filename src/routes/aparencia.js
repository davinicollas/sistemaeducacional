const express = require("express");
const controller = require("../controllers/aparenciaController");
const router = express.Router();
router.get("/aparencia", controller.index);
router.post("/aparencia", controller.save);
module.exports = router;
