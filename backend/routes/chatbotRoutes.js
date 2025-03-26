import express from "express";
import { getChatbotResponse } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/chat", getChatbotResponse);

// Placeholder route
router.get('/', (req, res) => {
  res.send('Chatbot API');
});

export default router;
