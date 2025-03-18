const express = require("express");
const { getChatbotResponse } = require("../controllers/chatbotController");

const router = express.Router();

router.post("/chat", getChatbotResponse);

module.exports = router;
