import Fuel from "../models/Fuel.js";

// Add a new fuel record
export const addFuel = async (req, res) => {
  try {
    const { vehicleId, driverId, liters, costPerLiter } = req.body;
    const totalCost = liters * costPerLiter;

    const fuelEntry = new Fuel({ vehicleId, driverId, liters, costPerLiter, totalCost });
    await fuelEntry.save();
    res.status(201).json({ message: "Fuel record added", fuelEntry });
  } catch (error) {
    res.status(500).json({ message: "Fuel record is not added", error });
  }
};

// Get all fuel records
export const getAllFuelRecords = async (req, res) => {
  try {
    const fuelRecords = await Fuel.find();
    res.status(200).json(fuelRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update fuel record
export const updateFuelRecord = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { driverId, liters, costPerLiter } = req.body;
    const totalCost = liters * costPerLiter;

    console.log(`Received Update Request for Vehicle ID: ${vehicleId}`);

    const existingFuelCost = await Fuel.findOne({ vehicleId });
    if (!existingFuelCost) {
      return res.status(404).json({ message: "Fuel Cost record has not been found for this vehicle." });
    }

    const updatedFuel = await Fuel.findOneAndUpdate(
      { vehicleId },
      { driverId, liters, costPerLiter, totalCost },
      { new: true }
    );

    if (!updatedFuel) {
      return res.status(500).json({ message: "Error updating Fuel record." });
    }

    res.status(200).json({ message: "Fuel Record Updated", updatedFuel });
  } catch (error) {
    res.status(500).json({ message: "Fsiled to Update Fuel record", error });
  }
};

// Delete fuel record
export const deleteFuelRecord = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const deleted = await Fuel.findOneAndDelete({ vehicleId });

    if (!deleted) {
      return res.status(404).json({ message: "Fuel record not found" });
    }

    res.status(200).json({ message: "Fuel record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete fuel record" });
  }
};