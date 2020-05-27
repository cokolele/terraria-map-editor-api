const router = require("express").Router();
const authController = require("../controllers/auth.js");

router.get("/user", authController.getUser);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/registration", authController.registration);

module.exports = router;