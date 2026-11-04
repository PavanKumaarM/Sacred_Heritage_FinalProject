const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, userController.getProfile);

router.patch("/me", authMiddleware, userController.updateProfile);

module.exports = router;