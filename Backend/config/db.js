const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "test"
        });

        console.log("MongoDB Connected Successfully");
        console.log("Database:", mongoose.connection.name);

    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;