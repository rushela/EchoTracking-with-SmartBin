const express = require("express");
const { deletePaymentRecord, getAllDriverPayments, processPayment, updateDriverPayment } = require("../controllers/PaymentController");

const router = express.Router();

router.post("/add", processPayment);
router.get("/all", getAllDriverPayments);
router.put("/:driverId", updateDriverPayment);
router.delete("/:driverId", deletePaymentRecord);

module.exports = router;
