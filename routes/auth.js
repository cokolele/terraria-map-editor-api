const router = require("express").Router();
const authController = require("../controllers/auth.js");

router.get("/auth", authController.login);

router.delete("/auth", authController.logout);

router.post("/auth", authController.register);

module.exports = router;