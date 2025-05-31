const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const authController = require("../controllers/authController");
const multer = require("multer");

const storage = multer.memoryStorage(); // keeps el image f el buffer l7d ma a3mlha encoding w a5znha f el db
const upload = multer({ storage });

router.post("/signup", upload.single("profileImage"), authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/checkAuth", verifyToken, authController.checkAuth);
router.get("/checkRole", verifyToken, authController.checkRole);

module.exports = router;