const express = require("express");
const controller = require("../controllers/loginController");
const router = express.Router();
router.get("/login", controller.index);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
module.exports = router;
