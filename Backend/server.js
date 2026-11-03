require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();



// MIDDLEWARE


app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// HOME ROUTE


app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Sacred Heritage Backend Running Successfully"
    });

});


// AUTHENTICATION ROUTES


app.use("/api/auth", require("./routes/authRoutes"));

// USER ROUTES


app.use("/api/users", require("./routes/userRoutes"));


// TEMPLE ROUTES


app.use("/api/temples", require("./routes/templeRoutes"));

// CATEGORY ROUTES


app.use("/api/categories", require("./routes/categoryRoutes"));


// PRODUCT ROUTES


app.use("/api/products", require("./routes/productRoutes"));


// REVIEW ROUTES


app.use("/api/reviews", require("./routes/reviewRoutes"));



// INVALID ROUTE


app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ERROR HANDLING


app.use(errorMiddleware);



// START SERVER

const PORT = process.env.PORT || 7000;

const startServer = async () => {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log(`Server running on port ${PORT}`);

        });

    } catch (error) {

        console.error("Server startup failed:", error.message);

        process.exit(1);

    }

};

startServer();