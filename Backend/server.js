import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// Debug logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Chat routes (protected by authMiddleware in chat.js)
app.use("/api", chatRoutes);

const startServer = async () => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from Backend/.env");
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from Backend/.env");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Server startup failed:", err.message);
        process.exit(1);
    }
};

startServer();
