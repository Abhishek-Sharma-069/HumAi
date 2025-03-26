import express from "express";
import {
  createHealthRecord,
  getHealthRecords,
  updateHealthRecord,
  deleteHealthRecord,
} from "../controllers/healthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createHealthRecord).get(protect, getHealthRecords);
router.route("/:id").put(protect, updateHealthRecord).delete(protect, deleteHealthRecord);

// Placeholder route
router.get('/', (req, res) => {
  res.send('Health API');
});

export default router;
