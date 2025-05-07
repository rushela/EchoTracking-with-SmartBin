const mongoose = require('mongoose');

const recyclingCenterSchema = new mongoose.Schema({
    centerId: { type: String, required: true, unique: true }, // Ensure centerId is unique
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    operationalHours: { type: String, required: true },
    materialsAccepted: { type: [String], required: true }, // Store materials as an array
    contactNumber: { type: String, required: true },
});

// Ensure indexes are properly set
recyclingCenterSchema.index({ centerId: 1 }, { unique: true });

const RecyclingCenter = mongoose.model('RecyclingCenter', recyclingCenterSchema);

module.exports = RecyclingCenter;
