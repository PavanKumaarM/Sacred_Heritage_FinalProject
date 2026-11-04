
const router = require("express").Router();

const {
    createPayment,
    getPayment
} = require("../controllers/payment.controller");

const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");

router.use(protect);

router.post(
    "/pay",
    asyncHandler(createPayment)
);

router.get(
    "/:paymentId",
    asyncHandler(getPayment)
);

module.exports = router;
