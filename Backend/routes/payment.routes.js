const express = require("express");
const router = express.Router();

const {
  createPayment
} = require("../controllers/payment.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/pay", protect, createPayment);

module.exports = router;