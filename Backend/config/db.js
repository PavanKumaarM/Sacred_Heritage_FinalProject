const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        console.log("Mongo URI loaded:", !!mongoURI);

        if (!mongoURI) {
            throw new Error("MONGO_URI not found. Check Backend/.env");
        }

        await mongoose.connect(mongoURI);

        console.log("MongoDB Connected Successfully");

    } catch (error) {
        console.error("MongoDB Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;