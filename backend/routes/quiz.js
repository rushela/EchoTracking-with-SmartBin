const express = require('express');
const Quiz = require('../models/Quiz');
const UserQuizAttempt = require('../models/UserQuizAttempt');
const quizAttemptController = require('../controllers/quizAttemptController');
const router = express.Router();

// POST: Create a quiz (Only environmentalists can create quizzes)
router.post('/create', async (req, res) => {
  const { question, options, correctAnswer, role } = req.body;

  if (role !== 'environmentalist') {
    return res.status(403).json({ message: 'Only environmentalists can create quizzes' });
  }

  try {
    const newQuiz = new Quiz({ question, options, correctAnswer, createdBy: 'Environmentalist' });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('❌ Quiz creation error:', error.message);
    res.status(400).json({ error: 'Failed to create quiz', details: error.message });
  }
});

// GET: Retrieve all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch quizzes' });
  }
});

// POST: Submit FULL Quiz (new)
router.post('/submit-quiz', quizAttemptController.submitQuiz);

module.exports = router;
