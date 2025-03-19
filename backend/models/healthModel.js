import mongoose from "mongoose";

const healthSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: { type: String, required: true },
    diagnosis: { type: String },
    medications: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const HealthRecord = mongoose.model("HealthRecord", healthSchema);
export default HealthRecord;
