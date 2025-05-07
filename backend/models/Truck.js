const mongoose = require('mongoose');

// Truck schema
const truckSchema = new mongoose.Schema({
    truckId: { type: String, required: true, unique: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null }, // Can be null if no driver assigned
    capacity: { type: Number, required: true }, // Truck capacity in liters or tons
    status: { type: String, default: 'active', enum: ['active', 'in maintenance'] } // Truck can be 'active' or 'in maintenance'
});

// Ensure unique truckId
truckSchema.index({ truckId: 1 }, { unique: true });

const Truck = mongoose.model('Truck', truckSchema);

module.exports = Truck;
