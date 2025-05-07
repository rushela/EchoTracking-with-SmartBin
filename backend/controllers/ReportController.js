// backend/controllers/ReportController.js
import Fuel from "../models/Fuel.js";
import Payment from "../models/Payment.js";
import Points from "../models/Points.js";

export const generateFullReport = async (req, res) => {
  try {
    const fuelData = await Fuel.find();
    const paymentData = await Payment.find();
    const pointsData = await Points.find();

    const totalFuelCost = fuelData.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    const totalPayment = paymentData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalEarnedPoints = pointsData.reduce((sum, item) => sum + (item.earnedPoints || 0), 0);

    const totalExpense = totalFuelCost + totalPayment + totalEarnedPoints;

    res.status(200).json({
      fuelData,
      paymentData,
      pointsData,
      totalExpense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch report data" });
  }
};
