const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { verifyToken } = require("../auth"); // Make sure this is imported!

// Public authentication paths
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/details", verifyToken, userController.getUserDetails);

module.exports = router;
