const UserQuizAttempt = require('../models/UserQuizAttempt');

exports.submitQuiz = async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;

    if (!userId || !quizId || !answers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Count previous attempts
    const previousAttempts = await UserQuizAttempt.countDocuments({ userId });

    if (previousAttempts >= 3) {
      return res.status(403).json({ message: 'You have already attempted the quiz 3 times.' });
    }

    // Calculate total score
    let totalScore = 0;
    answers.forEach((answer) => {
      totalScore += answer.score;
    });

    // Save the attempt
    const newAttempt = new UserQuizAttempt({
      userId,
      quizId,
      answers,
      totalScore,
    });

    await newAttempt.save();

    res.status(200).json({
      message: 'Quiz submitted successfully',
      totalScore,
      attemptsLeft: 2 - previousAttempts, // Remaining attempts
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
