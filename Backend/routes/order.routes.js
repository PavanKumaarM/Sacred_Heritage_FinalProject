
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById
} = require("../controllers/order.controller");

const { protect } = require("../middleware/auth.middleware");

// Authenticated order routes
router.post("/", protect, createOrder);

// My orders — keep before /:id
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, getMyOrders);

// Individual order
router.get("/:id", protect, getOrderById);

module.exports = router;
