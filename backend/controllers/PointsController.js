import Points from "../models/Points.js";

// Add points to a user
export const addPoints = async (req, res) => {
  try {
    const { userId, points, source } = req.body;

    if (!userId || !points || !source) {
      return res.status(400).json({ message: "User ID, points, and source are required" });
    }

    const userPoints = new Points({ userId, earnedPoints: points, currentPoints: points, source });
    await userPoints.save();

    res.status(201).json({ message: "Points added successfully", userPoints });
  } catch (error) {
    res.status(500).json({ message: "Failed to add points. Please try again.", error });
  }
};

// Redeem points
export const redeemPoints = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from URL params
    const { earnedPoints } = req.body; // Get the earnedPoints from request body

    const userPoints = await Points.findOne({ userId });

    if (!userPoints) {
      return res.status(400).json({ message: "No redeemable points found" });
    }

    if (userPoints.redeemed) {
      return res.status(400).json({ message: "Points already redeemed." });
    }

    userPoints.redeemed = true;
    userPoints.redeemedPoints = earnedPoints; // Move earned points to redeemed points
    userPoints.earnedPoints = 0; // Set earnedPoints to 0 after redemption
    userPoints.currentPoints = 0; // Set currentPoints to 0 after redemption

    await userPoints.save();

    res.status(200).json({ message: "Points redeemed successfully", userPoints });
  } catch (error) {
    res.status(500).json({ message: "Error redeeming points", error });
  }
};

// Update Points (for editing)
export const updatePoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const { earnedPoints, source, redeemed, date } = req.body;

    const userPoints = await Points.findOne({ userId });

    if (!userPoints) {
      return res.status(404).json({ message: "User points record not found" });
    }

    const prevEarnedPoints = userPoints.earnedPoints;
    userPoints.source = source;
    userPoints.redeemed = redeemed;
    userPoints.date = date;

    if (redeemed) {
      userPoints.redeemedPoints = earnedPoints ?? prevEarnedPoints;
      userPoints.earnedPoints = 0;
      userPoints.currentPoints = 0;
    } else {
      if (!earnedPoints && earnedPoints !== 0) {
        userPoints.earnedPoints = prevEarnedPoints;
        userPoints.redeemedPoints = 0;
        userPoints.currentPoints = prevEarnedPoints;
      } else {
        userPoints.earnedPoints = earnedPoints;
        userPoints.redeemedPoints = 0;
        userPoints.currentPoints = earnedPoints;
      }
    }

    await userPoints.save();

    res.status(200).json({ message: "Points updated successfully", userPoints });
  } catch (error) {
    res.status(500).json({ message: "Error updating points", error });
  }
};

// Show all Points Collection
export const getAllPoints = async (req, res) => {
  try {
    const allPoints = await Points.find();
    if (allPoints.length === 0) {
      return res.status(404).json({ message: "No points found" });
    }
    res.status(200).json(allPoints);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve points" });
  }
};

// Get points record by userId
export const getPointsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const record = await Points.findOne({ userId });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Redeemed Points
export const deleteRedeemedPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the points for the given userId and delete the redeemed points
    const deletedPoints = await Points.findOneAndDelete({ userId });

    if (!deletedPoints) {
      return res.status(404).json({ message: "Redeemed points record not found for this user." });
    }

    res.status(200).json({ message: "Redeemed points record deleted successfully", deletedPoints });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete redeemed points record", error });
  }
};

