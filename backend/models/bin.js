const mongoose = require('mongoose');

// Garbage Bin schema
const binSchema = new mongoose.Schema({
    binId: { type: String, required: true, unique: true },   // Unique bin identifier
    location: { type: String, required: true },               // Bin location (e.g., address)
    type: { type: String, required: true },                   // Waste type (e.g., organic, plastic)
    fillLevel: { type: Number, default: 0, min: 0, max: 100 } // Percentage of fill (0-100)
});

// Ensure binId is unique
binSchema.index({ binId: 1 }, { unique: true });

const Bin = mongoose.model('Bin', binSchema);

module.exports = Bin;
