const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

console.log("==================================");
console.log("Starting RentEase Backend...");
console.log("PORT:", process.env.PORT);
console.log("Mongo URL Found:", !!process.env.MONGO_URL);
console.log("==================================");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000
        });

        console.log("✅ MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.log("==================================");
        console.log("❌ MongoDB Connection Failed");
        console.log("Name:", err.name);
        console.log("Message:", err.message);
        console.log("Code:", err.code);
        console.log("==================================");
        console.error(err);
    }
}

startServer();