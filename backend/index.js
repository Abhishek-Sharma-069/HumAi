import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch(err => {
        console.log("❌ MongoDB connection error:", err);
    });

// Import routes
import userRoutes from "./routes/userRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";

// Use routes
app.get('/', (req, res) => {
    res.send("Welcome to the Health Chatbot API");
});
app.use("/api/users", userRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/articles", articleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});




