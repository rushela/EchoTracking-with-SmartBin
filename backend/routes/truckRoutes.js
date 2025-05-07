const express = require('express');
const Truck = require('../models/Truck');
const Driver = require('../models/Driver');  // Import Driver model
const router = express.Router();

// POST - Register a new truck
router.post('/add', async (req, res) => {
    try {
        const { truckId, capacity } = req.body;

        // Check if the truck already exists
        const existingTruck = await Truck.findOne({ truckId });
        if (existingTruck) {
            return res.status(400).json({ message: 'Truck ID already exists' });
        }

        const newTruck = new Truck({ truckId, capacity });

        await newTruck.save(); // Save truck to DB
        res.status(201).json({ message: 'Truck added successfully', truck: newTruck });

    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

// GET - Retrieve all trucks
router.get('/list', async (req, res) => {
    try {
        const trucks = await Truck.find().populate('driverId', 'name contactNumber'); // Show driver details if assigned
        res.json(trucks);
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

// GET - Retrieve a single truck
router.get('/get/:truckId', async (req, res) => {
    try {
        const truck = await Truck.findOne({ truckId: req.params.truckId })
            .populate('driverId', 'name contactNumber');
        
        if (!truck) {
            return res.status(404).json({ message: 'Truck not found' });
        }
        
        res.json(truck);
    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

// PUT - Update truck
router.put('/update/:truckId', async (req, res) => {
    try {
        const { status, driverId, capacity } = req.body;

        // Find the truck by truckId
        const truck = await Truck.findOne({ truckId: req.params.truckId });

        if (!truck) {
            return res.status(404).json({ message: 'Truck not found' });
        }

        // Update truck fields if provided
        if (status) truck.status = status;
        if (capacity) truck.capacity = capacity;

        // Update truck driver if a driverId is provided
        if (driverId) {
            truck.driverId = driverId;

            // Find the driver and update their working rides
            const driver = await Driver.findById(driverId);
            if (driver) {
                driver.workingRides = (driver.workingRides || 0) + 1;  // Increment working rides
                await driver.save();  // Save the updated driver
            } else {
                return res.status(404).json({ message: 'Driver not found' });
            }
        }

        await truck.save();  // Save the updated truck
        res.status(200).json({ message: 'Truck updated successfully', truck });

    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

// DELETE - Remove truck
router.delete('/delete/:truckId', async (req, res) => {
    try {
        const truck = await Truck.findOneAndDelete({ truckId: req.params.truckId });

        if (!truck) {
            return res.status(404).json({ message: 'Truck not found' });
        }

        res.status(200).json({ message: `Truck with ID ${req.params.truckId} deleted successfully` });

    } catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

module.exports = router;
