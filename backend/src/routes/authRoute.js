const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const authController = require("../controllers/authController");

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/checkAuth").get(verifyToken, authController.checkAuth);

module.exports = router;
