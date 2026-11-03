const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const cartRoutes = require("./routes/cart.routes");
const couponRoutes = require("./routes/coupon.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const darshanRoutes = require("./routes/darshan.routes");
const bookingRoutes = require("./routes/booking.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Transaction Backend Running"
    });
});

app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/darshan", darshanRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/history", historyRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});