// controllers/financialController.js
const Financial = require('../models/Financial');

// Controller method to create a financial transaction
exports.createTransaction = async (req, res) => {
  const { transactionType, amount, description } = req.body;

  try {
    const newTransaction = new Financial({
      transactionType,
      amount,
      description,
    });
    await newTransaction.save();
    res.status(201).json(newTransaction); // Return created transaction
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' }); // Return error
  }
};

// Controller method to get all financial transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Financial.find();
    res.status(200).json(transactions); // Return all transactions
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
