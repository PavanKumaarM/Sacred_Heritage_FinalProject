const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/me", protect, asyncHandler(userController.getProfile));

router.patch("/me", protect, asyncHandler(userController.updateProfile));

module.exports = router;