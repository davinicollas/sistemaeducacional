const express = require("express");
const controller = require("../controllers/loginController");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Muitas tentativas. Tente novamente mais tarde.",
});
router.get("/login", controller.index);
router.post("/login", loginLimiter, controller.login);
router.get("/logout", controller.logout);
module.exports = router;
