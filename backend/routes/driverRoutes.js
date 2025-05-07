const express = require('express');
const Driver = require('../models/Driver');
const router = express.Router();

// GET - List all drivers
router.get('/list', async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

// POST - Add new driver
router.post('/add', async (req, res) => {
    try {
        const { driverId, name, licenseNumber, contactNumber } = req.body;

        // Check if driver already exists
        const existingDriver = await Driver.findOne({ driverId });
        if (existingDriver) {
            return res.status(400).json({ message: 'Driver ID already exists' });
        }

        const newDriver = new Driver({
            driverId,
            name,
            licenseNumber,
            contactNumber
        });

        await newDriver.save();
        res.status(201).json({ message: 'Driver added successfully', driver: newDriver });
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

// PUT - Update driver
router.put('/update/:id', async (req, res) => {
    try {
        const { name, licenseNumber, contactNumber } = req.body;
        const driverId = req.params.id;

        const driver = await Driver.findOne({ driverId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Update driver fields
        driver.name = name;
        driver.licenseNumber = licenseNumber;
        driver.contactNumber = contactNumber;

        await driver.save();
        res.json({ message: 'Driver updated successfully', driver });
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

// DELETE - Delete driver
router.delete('/delete/:id', async (req, res) => {
    try {
        const driver = await Driver.findOneAndDelete({ driverId: req.params.id });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

module.exports = router;
