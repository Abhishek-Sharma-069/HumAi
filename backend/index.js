import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import { db } from './config/firebase.js'; // Use Firestore instance from firebase.js

// Firebase initialization after env config
const { app: firebaseApp } = await import('./config/firebase.js');

const app = express();

// Remove the redundant admin.initializeApp() and serviceAccount import

// Debugging: Log environment variables
console.log('🔍 Debugging Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log();
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Debugging: Log middleware setup
console.log('✅ Middleware configured');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error Middleware:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
console.log('🔍 Setting up routes...');
app.get('/', (req, res) => {
  res.send("Welcome to the Health Chatbot API");
});

try {
  app.use("/api/users", userRoutes); // Ensure userRoutes is correctly imported
  app.use("/api/chatbot", chatbotRoutes); // Ensure chatbotRoutes is correctly imported
  app.use("/api/health", healthRoutes); // Ensure healthRoutes is correctly imported
  app.use("/api/articles", articleRoutes); // Ensure articleRoutes is correctly imported
  console.log('✅ Routes configured');
} catch (error) {
  console.error('❌ Error setting up routes:', error.message);
}

// Handle 404
app.use((req, res) => {
  console.warn(`⚠️ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app;




