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

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/admin", require("./routes/admin"));

/* ---------------- PORT ---------------- */
const PORT = process.env.PORT || 5000;

/* ---------------- SERVER START ---------------- */
async function startServer() {
    try {
        // ✅ Validate env
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is missing in environment variables");
        }

        // ✅ MongoDB connection
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000
        });

        console.log("✅ MongoDB Connected Successfully");

        // ✅ Start server
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.log("==================================");
        console.log("❌ SERVER START FAILED");
        console.log("Error Name:", err.name);
        console.log("Message:", err.message);
        console.log("==================================");

        // ❌ Force crash so Render restarts properly
        process.exit(1);
    }
}

startServer();