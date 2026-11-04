
const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const asyncHandler = require("../middleware/asyncHandler");

router.post("/signup", asyncHandler(authController.signup));

router.post("/login", asyncHandler(authController.login));

module.exports = router;
