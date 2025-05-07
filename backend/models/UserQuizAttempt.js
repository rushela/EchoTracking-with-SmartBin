const mongoose = require('mongoose');

const userQuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    selectedAnswer: { type: String, required: true },
    score: { type: Number, required: true },
  }],
  totalScore: { type: Number, default: 0 },
  dateTaken: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserQuizAttempt', userQuizAttemptSchema);
