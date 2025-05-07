import mongoose from "mongoose";

const financialSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    required: true,
    enum: ['driver_payment', 'fuel_cost', 'reward_redemption'],
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Financial = mongoose.model('Financial', financialSchema);

module.exports = Financial;
