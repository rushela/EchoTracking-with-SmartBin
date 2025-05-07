// routes/financialRoutes.js
const express = require('express');
const router = express.Router();
const Financial = require('../models/Financial');

// Route to create a new financial transaction (e.g., Driver Payment, Fuel Cost)
router.post('/transaction', async (req, res) => {
  const { transactionType, amount, description } = req.body;

  try {
    const newTransaction = new Financial({ transactionType, amount, description });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all financial transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Financial.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
