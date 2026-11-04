const express = require("express");
const router = express.Router();

const {
    createBooking,
    cancelBooking
} = require("../controllers/booking.controller");

const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");

// Create booking - Login required
router.post(
    "/",
    protect,
    asyncHandler(createBooking)
);

// Cancel booking - Login required
router.patch(
    "/:id/cancel",
    protect,
    asyncHandler(cancelBooking)
);

module.exports = router;