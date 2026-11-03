const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sacred Heritage Backend Running Successfully",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Transaction Backend Running",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/temples", require("./routes/templeRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/coupons", require("./routes/coupon.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/darshan", require("./routes/darshan.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/history", require("./routes/history.routes"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 7000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();