const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");

// Public routes
router.get(
    "/temple/:templeId",
    asyncHandler(productController.getProductsByTemple)
);

router.get(
    "/",
    asyncHandler(productController.getAllProducts)
);

router.get(
    "/:id",
    asyncHandler(productController.getProductById)
);

// Authenticated routes
router.post(
    "/",
    protect,
    asyncHandler(productController.createProduct)
);

router.patch(
    "/:id",
    protect,
    asyncHandler(productController.updateProduct)
);

router.delete(
    "/:id",
    protect,
    asyncHandler(productController.deleteProduct)
);

module.exports = router;