import HealthRecord from "../models/healthModel.js";

// @desc Create new health record
// @route POST /api/health
const createHealthRecord = async (req, res) => {
  try {
    const { symptoms, diagnosis, medications, notes } = req.body;

    const newRecord = await HealthRecord.create({
      user: req.user.id,
      symptoms,
      diagnosis,
      medications,
      notes,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Error creating health record" });
  }
};

// @desc Get all health records of the logged-in user
// @route GET /api/health
const getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user.id });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching health records" });
  }
};

// @desc Update a health record
// @route PUT /api/health/:id
const updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    record.symptoms = req.body.symptoms || record.symptoms;
    record.diagnosis = req.body.diagnosis || record.diagnosis;
    record.medications = req.body.medications || record.medications;
    record.notes = req.body.notes || record.notes;

    const updatedRecord = await record.save();
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: "Error updating health record" });
  }
};

// @desc Delete a health record
// @route DELETE /api/health/:id
const deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await record.remove();
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting health record" });
  }
};

export { createHealthRecord, getHealthRecords, updateHealthRecord, deleteHealthRecord };
