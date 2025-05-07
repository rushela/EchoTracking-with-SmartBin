import mongoose from "mongoose";

const PointsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  earnedPoints: { type: Number, default: 0 }, // Add earnedPoints
  currentPoints: { type: Number, default: 0 }, // Add currentPoints
  redeemed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("PointsRedeem", PointsSchema);
