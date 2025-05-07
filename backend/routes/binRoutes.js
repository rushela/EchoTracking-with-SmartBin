const express = require('express');
const Bin = require('../models/bin');
const router = express.Router();

// POST - Add a new bin
router.post('/add', async (req, res) => {
  try {
    const { binId, location, type, fillLevel } = req.body;

    const existingBin = await Bin.findOne({ binId });
    if (existingBin) {
      return res.status(400).json({ message: 'Bin ID already exists' });
    }

    const newBin = new Bin({
      binId,
      location,
      type,
      fillLevel: fillLevel || 0
    });

    await newBin.save();
    res.status(201).json({ message: 'Bin added successfully', bin: newBin });

  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

// PUT - Update bin fill level
router.put('/update-fill/:binId', async (req, res) => {
  try {
    const { binId } = req.params;
    const { fillLevel } = req.body;

    if (fillLevel < 0 || fillLevel > 100) {
      return res.status(400).json({ message: 'Fill level must be between 0 and 100' });
    }

    const bin = await Bin.findOne({ binId });
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    bin.fillLevel = fillLevel;
    await bin.save();

    res.status(200).json({ message: 'Bin fill level updated', bin });

  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

// GET - Get all bins
router.get('/list', async (req, res) => {
  try {
    const bins = await Bin.find({}, { _id: 0, binId: 1, location: 1, type: 1, fillLevel: 1 });
    res.json(bins);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

// DELETE - Remove a bin
router.delete('/delete/:binId', async (req, res) => {
  try {
    const bin = await Bin.findOneAndDelete({ binId: req.params.binId });

    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    res.status(200).json({ message: `Bin with ID ${req.params.binId} deleted successfully` });

  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

// POST: Update bin fill level from IoT device
router.post('/iot-update/:binId', async (req, res) => {
  const binId = req.params.binId;
  const { fillLevel } = req.body;

  // Validate the fillLevel value is a number between 0 and 100
  if (typeof fillLevel !== 'number' || fillLevel < 0 || fillLevel > 100) {
    return res.status(400).json({ message: 'Invalid fillLevel. It must be a number between 0 and 100.' });
  }

  try {
    // Find the bin with the given binId and update its fillLevel
    const updatedBin = await Bin.findOneAndUpdate(
      { binId },
      { fillLevel },
      { new: true }
    );

    if (!updatedBin) {
      return res.status(404).json({ message: 'Bin not found.' });
    }

    res.status(200).json({ message: 'Bin updated successfully.', bin: updatedBin });
  } catch (error) {
    console.error('Error updating bin:', error);
    res.status(500).json({ message: 'Server error updating bin.' });
  }
});


module.exports = router;
