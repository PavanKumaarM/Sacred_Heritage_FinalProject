const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");

// Public route
router.get(
    "/",
    asyncHandler(categoryController.getAllCategories)
);

// Authenticated routes
router.post(
    "/",
    protect,
    asyncHandler(categoryController.createCategory)
);

router.patch(
    "/:id",
    protect,
    asyncHandler(categoryController.updateCategory)
);

router.delete(
    "/:id",
    protect,
    asyncHandler(categoryController.deleteCategory)
);

module.exports = router;