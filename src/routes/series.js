const express = require("express");
const controller = require("../controllers/serieController");
const router = express.Router();
router.get("/series", controller.index);
router.post("/series/excluir/:id", controller.remove);
router.post("/series", controller.save);
router.post(
  "/series-importar-excel",
  controller.upload.single("arquivo"),
  controller.importExcel,
);
module.exports = router;
