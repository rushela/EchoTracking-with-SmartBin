const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  driverId: { type: String, required: true },
  workingDays: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
