const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  createdBy: { type: String }, // Can be "Environmentalist"
});

module.exports = mongoose.model('Quiz', quizSchema);
