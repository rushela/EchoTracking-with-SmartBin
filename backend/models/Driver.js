const mongoose = require('mongoose');
const Payment = require('./Payment');

// Driver schema definition
const driverSchema = new mongoose.Schema({
    driverId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    assignedTruckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' }, // Reference to Truck model
    contactNumber: { type: String, required: true },
    status: { type: String, default: 'active' }, // active, inactive
    workingRides: { type: Number, default: 0 } // Tracks the number of working rides (assignments)
});

// Ensure indexes are created correctly
driverSchema.index({ driverId: 1 }, { unique: true });

// Pre-save hook to update payment when workingRides changes
driverSchema.pre('save', async function(next) {
    if (this.isModified('workingRides')) {
        try {
            // Find or create a payment record for this driver
            const payment = await Payment.findOne({ driverId: this.driverId });
            
            if (payment) {
                // Update existing payment record
                payment.workingDays = this.workingRides;
                await payment.save();
            } else {
                // Create new payment record
                await Payment.create({
                    driverId: this.driverId,
                    workingDays: this.workingRides,
                    amount: 0, // Default amount, can be updated later
                    status: "Pending"
                });
            }
        } catch (error) {
            console.error('Error updating payment record:', error);
        }
    }
    next();
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
