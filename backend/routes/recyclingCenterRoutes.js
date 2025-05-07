const express = require('express');
const RecyclingCenter = require('../models/RecyclingCenter');
const router = express.Router();

//POST - Register a new recycling center
router.post('/register', async (req, res) => {
    try {
        const { centerId, name, location, operationalHours, materialsAccepted, contactNumber } = req.body;

        // Check if centerId is provided
        if (!centerId) {
            return res.status(400).json({ message: 'centerId is required' });
        }

        // Check if the recycling center already exists
        const existingCenter = await RecyclingCenter.findOne({ centerId });
        if (existingCenter) {
            return res.status(400).json({ message: 'Recycling center ID already exists' });
        }

        const newCenter = new RecyclingCenter({
            centerId, // Ensure centerId is saved
            name,
            location,
            operationalHours,
            materialsAccepted,
            contactNumber
        });

        await newCenter.save(); // Save to MongoDB
        res.status(201).json({ message: 'Recycling Center registered successfully', center: newCenter });

    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});


//GET - Retrieve all recycling centers
router.get('/list', async (req, res) => {
    try {
        const centers = await RecyclingCenter.find();
        res.json(centers);
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

//PUT - Update recycling center details
router.put('/update/:centerId', async (req, res) => {
    try {
        const { name, location, operationalHours, materialsAccepted, contactNumber } = req.body;

        // Find recycling center by centerId
        const center = await RecyclingCenter.findOne({ centerId: req.params.centerId });

        if (!center) {
            return res.status(404).json({ message: 'Recycling Center not found' });
        }

        // Update fields if provided
        if (name) center.name = name;
        if (location) center.location = location;
        if (operationalHours) center.operationalHours = operationalHours;
        if (materialsAccepted) center.materialsAccepted = materialsAccepted;
        if (contactNumber) center.contactNumber = contactNumber;

        await center.save(); // Save updated center
        res.status(200).json({ message: 'Recycling Center updated successfully', center });

    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

//DELETE - Remove recycling center
router.delete('/delete/:centerId', async (req, res) => {
    try {
        const center = await RecyclingCenter.findOneAndDelete({ centerId: req.params.centerId });

        if (!center) {
            return res.status(404).json({ message: 'Recycling Center not found' });
        }

        res.status(200).json({ message: `Recycling Center with ID ${req.params.centerId} deleted successfully` });

    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

module.exports = router;
