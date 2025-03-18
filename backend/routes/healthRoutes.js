const express = require("express");
const { saveHealthData, getHealthData } = require("../controllers/healthController");

const router = express.Router();

router.post("/save", saveHealthData);
router.get("/data", getHealthData);

module.exports = router;
