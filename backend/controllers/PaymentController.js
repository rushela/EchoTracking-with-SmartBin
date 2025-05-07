const Payment = require("../models/Payment");
// ✅ COMMENTED OUT because Driver.js is not connected yet
// const Driver = require("../models/Driver");

// Process driver payment
const processPayment = async (req, res) => {
  try {
    const { driverId, workingRides } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required." });
    }

    if (workingRides === undefined || workingRides < 0) {
      return res.status(400).json({ message: "Valid working rides must be provided." });
    }

    const dailyWage = 2000;
    const amount = dailyWage * workingRides;

    const payment = new Payment({
      driverId,
      workingDays: workingRides,   // Store workingRides in workingDays field
      amount,
      status: "Completed"
    });

    await payment.save();

    res.status(201).json({
      message: "Payment processed successfully.",
      driverId,
      workingRides,
      dailyWage,
      calculatedAmount: amount,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: "Payment processing failed", error });
  }
};

// ✅ No change below this - same as your code:

// Get all driver payments
const getAllDriverPayments = async (req, res) => {
  try {
    const driverPayments = await Payment.find();

    if (driverPayments.length === 0) {
      return res.status(404).json({ message: "No Driver Payment Record has been Found" });
    }

    res.status(200).json(driverPayments);
  } catch (error) {
    res.status(500).json({ message: "Payment Server error" });
  }
};

// Update driver payments
const updateDriverPayment = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { workingDays } = req.body;  // Still using workingDays field

    console.log(`Update Request - DriverID: ${driverId}, Working Days: ${workingDays}`);

    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required." });
    }

    if (!workingDays || workingDays <= 0) {
      return res.status(400).json({ message: "Valid working rides must be provided." });
    }

    const dailyWage = 2000;
    const calculatedAmount = dailyWage * workingDays;

    const existingPayment = await Payment.findOne({ driverId });
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment record has Not been Found" });
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { driverId },
      { workingDays, amount: calculatedAmount },
      { new: true }
    );

    res.status(200).json({
      message: "Payment updated based on Working Rides.",
      driverId,
      workingRides: workingDays,
      dailyWage,
      calculatedAmount,
      updatedPayment
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to Update Driver Payment.", error });
  }
};

// Delete driver payments
const deletePaymentRecord = async (req, res) => {
  try {
    const { driverId } = req.params;
    console.log(`Delete Request for DriverID: ${driverId}`);

    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required." });
    }

    const existingPayment = await Payment.findOne({ driverId });
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment record not found for this driver." });
    }

    const deletedPayment = await Payment.findOneAndDelete({ driverId });

    res.status(200).json({ message: "Payment Record Deleted Successfully", deletedPayment });
  } catch (error) {
    res.status(500).json({ message: "Deleting Payment Record is Unsuccessful!", error });
  }
};

module.exports = {
  processPayment,
  getAllDriverPayments,
  updateDriverPayment,
  deletePaymentRecord
};
