const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    healthData: {
        bloodPressure: String,
        bloodSugar: String,
        heartRate: String,
        temperature: String,
    },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const HealthData = mongoose.model("HealthData", healthSchema);

module.exports = HealthData;
