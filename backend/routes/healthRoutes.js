import express from "express";
import {
  createHealthRecord,
  getHealthRecords,
  updateHealthRecord,
  deleteHealthRecord,
} from "../controllers/healthController.js";
import { analyzeSymptoms } from "../controllers/symptomController.js";
import { healthCheck } from "../controllers/healthCheckController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/check", healthCheck);
router.route("/").post(protect, createHealthRecord).get(protect, getHealthRecords);
router.post("/analyze-symptoms", protect, analyzeSymptoms);
router.route("/:id").put(protect, updateHealthRecord).delete(protect, deleteHealthRecord);

// Placeholder route
router.get('/', (req, res) => {
  res.send('Health API');
});

export default router;
