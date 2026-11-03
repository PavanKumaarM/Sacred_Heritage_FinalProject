
const router = require("express").Router();

const controller = require("../controllers/cart.controller");
const asyncHandler = require("../middleware/asyncHandler");
const { protect } = require("../middleware/auth.middleware");

// All cart routes require authentication
router.use(protect);

// Get user's cart
router.get("/", asyncHandler(controller.getCart));

// Add product
router.post("/items", asyncHandler(controller.addItem));

// Update quantity
router.patch("/items/:itemId", asyncHandler(controller.updateItem));

// Remove individual item
router.delete("/items/:itemId", asyncHandler(controller.removeItem));

// Clear entire cart
router.delete("/", asyncHandler(controller.clearCart));

module.exports = router;
