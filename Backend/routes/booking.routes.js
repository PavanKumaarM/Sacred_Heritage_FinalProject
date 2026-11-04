const express = require("express");
const router = express.Router();

const {
  createBooking,
  cancelBooking
} = require("../controllers/booking.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, createBooking);
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;