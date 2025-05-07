import mongoose from 'mongoose';

const PointsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  earnedPoints: { type: Number, default: 0 },  // Points earned by the user
  currentPoints: { type: Number, default: 0 }, // Points available before redemption
  redeemedPoints: { type: Number, default: 0 }, // Redeemed points (this will store the redeemed points)
  redeemed: { type: Boolean, default: false }, // Redeemed status
  source: { type: String, required: true },  // Source of points (e.g., quiz, correct disposal)
  date: { type: Date, default: Date.now }, // Date when the points were added
});

export default mongoose.model("Points", PointsSchema);
