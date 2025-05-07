import mongoose from "mongoose";

const FuelSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  driverId: { type: String, required: true },
  liters: { type: Number, required: true },
  costPerLiter: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("FuelCost", FuelSchema);
