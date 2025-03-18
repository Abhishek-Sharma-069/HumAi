const HealthData = require("../models/healthModel");

// Create health data
const saveHealthData = async (req, res) => {
    try {
        const { userId, healthData } = req.body;
        
        const newHealthData = new HealthData({ userId, healthData });
        await newHealthData.save();
        
        res.status(201).json({ message: "Health data saved successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all health data for a user
const getHealthData = async (req, res) => {
    try {
        const { userId } = req.params;
        const healthData = await HealthData.find({ userId });

        if (!healthData) return res.status(404).json({ message: "No health data found" });
        
        res.status(200).json(healthData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveHealthData, getHealthData };
