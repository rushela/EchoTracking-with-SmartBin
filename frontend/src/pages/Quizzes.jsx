// src/pages/Quizzes.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Flex,
  Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import '../style.css';
import { jsPDF } from 'jspdf';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [reviewData, setReviewData] = useState([]);
  const [currentEmoji, setCurrentEmoji] = useState('📚');

  // Load userId from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = storedUser._id || '';

  // Animated emojis
  useEffect(() => {
    const emojis = ['📚', '🧠', '🏆'];
    let idx = 0;
    const iv = setInterval(() => {
      setCurrentEmoji(emojis[idx]);
      idx = (idx + 1) % emojis.length;
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Fetch quiz data
  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz')
      .then((res) => {
        setQuizzes(res.data);
        setCurrentQuizIndex(0);
      })
      .catch((err) => {
        console.error('Error fetching quiz data:', err);
        alert('Failed to load quizzes');
      });
  }, []);

  const startQuiz = () => {
    if (attemptsLeft <= 0) {
      alert('❌ You have reached the maximum of 3 attempts.');
      return;
    }
    resetQuiz();
    setQuizStarted(true);
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setAnswers([]);
    setCorrectAnswers(0);
    setTotalPoints(0);
    setReviewData([]);
  };

  const handleAnswerSelect = (value) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }
    const updated = [...answers];
    updated[currentQuizIndex] = selectedAnswer;
    setAnswers(updated);
    setSelectedAnswer('');
    setCurrentQuizIndex((i) => i + 1);
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex((i) => i - 1);
      setSelectedAnswer(answers[currentQuizIndex - 1] || '');
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer before submitting');
      return;
    }
    const updated = [...answers];
    updated[currentQuizIndex] = selectedAnswer;
    setAnswers(updated);

    setIsSubmitting(true);
    try {
      let correct = 0;
      const answerObjects = updated.map((ans, idx) => {
        const isCorrect = ans === quizzes[idx].correctAnswer;
        if (isCorrect) correct += 1;
        return { selectedAnswer: ans, score: isCorrect ? 2 : 0 };
      });

      const reviewList = quizzes.map((q, idx) => ({
        question: q.question,
        correctAnswer: q.correctAnswer,
        selectedAnswer: updated[idx],
        isCorrect: updated[idx] === q.correctAnswer
      }));

      const submission = {
        userId,
        quizId: quizzes[0]?._id,
        answers: answerObjects
      };

      const res = await axios.post(
        'http://localhost:5000/api/quiz/submit-quiz',
        submission
      );

      setCorrectAnswers(correct);
      setTotalPoints(correct * 2);
      setAttemptsLeft(res.data.attemptsLeft);
      setReviewData(reviewList);

      alert(
        `🎉 Submitted!\nCorrect: ${correct}\nPoints: ${correct * 2}\nAttempts Left: ${res.data.attemptsLeft}`
      );
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Quiz Performance Report', 20, 20);

    doc.setFontSize(14);
    doc.text(`Total Questions: ${quizzes.length}`, 20, 40);
    doc.text(`Correct Answers: ${correctAnswers}`, 20, 50);
    doc.text(`Wrong Answers: ${quizzes.length - correctAnswers}`, 20, 60);
    doc.text(`Points Earned: ${totalPoints}`, 20, 70);
    const pct = ((correctAnswers / quizzes.length) * 100).toFixed(2);
    doc.text(`Score: ${pct}%`, 20, 80);

    doc.save('quiz_report.pdf');
  };

  if (!quizzes.length && quizStarted) {
    return <Spinner size="xl" color="teal" />;
  }

  return (
    <Box
      p={6}
      bg="green.600"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Heading as="h1" size="2xl" color="white" mb={6}>
        Quiz Time!
      </Heading>

      {!quizStarted ? (
        <Box textAlign="center">
          <Box fontSize="80px" mb={4} animation="bounce 2s infinite">
            {currentEmoji}
          </Box>
          <Heading size="lg" color="white" mb={4}>
            Welcome to the Ultimate Quiz Challenge! 🌟
          </Heading>
          <Text fontSize="lg" color="white" mb={8}>
            Test your knowledge, earn points, and unlock rewards! 📚
          </Text>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={startQuiz}
            borderRadius="lg"
            boxShadow="lg"
            mb={6}
            _hover={{ transform: 'scale(1.05)', bg: 'teal.600' }}
            isDisabled={attemptsLeft <= 0}
          >
            {attemptsLeft <= 0 ? 'No More Attempts ❌' : 'Start Quiz'}
          </Button>
        </Box>
      ) : correctAnswers || totalPoints ? (
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          width={{ base: '80%', sm: '60%', md: '50%' }}
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
        >
          <Heading size="lg" mb={4} color="teal.600">
            Quiz Completed!
          </Heading>
          <Text fontSize="xl" color="teal.700" mt={4}>
            Correct Answers: {correctAnswers}
          </Text>
          <Text fontSize="xl" color="teal.700" mt={2}>
            Total Points: {totalPoints}
          </Text>
          <Text fontSize="md" color="gray.600" mt={2}>
            Attempts Left: {attemptsLeft}
          </Text>

          <Button
            mt={4}
            colorScheme="teal"
            onClick={downloadReport}
            _hover={{ bg: 'teal.600' }}
          >
            Download Report as PDF
          </Button>

          {attemptsLeft > 0 && (
            <Button
              mt={4}
              colorScheme="teal"
              onClick={startQuiz}
              _hover={{ transform: 'scale(1.05)' }}
            >
              Retry Quiz
            </Button>
          )}

          <Box mt={8} textAlign="left">
            <Heading size="md" mb={4} color="teal.600">
              Review Your Answers:
            </Heading>
            {reviewData.map((item, idx) => (
              <Box
                key={idx}
                mb={4}
                p={4}
                border="1px solid #e2e8f0"
                borderRadius="md"
              >
                <Text fontWeight="bold">
                  {idx + 1}. {item.question}
                </Text>
                <Text>Your Answer: {item.selectedAnswer}</Text>
                <Text>Correct Answer: {item.correctAnswer}</Text>
                <Text color={item.isCorrect ? 'green.500' : 'red.500'}>
                  {item.isCorrect ? '✅ Correct' : '❌ Wrong'}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          width={{ base: '80%', sm: '60%', md: '50%' }}
          _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
        >
          <Heading size="lg" mb={4} color="teal.600">
            {quizzes[currentQuizIndex]?.question}
          </Heading>

          <RadioGroup
            onChange={handleAnswerSelect}
            value={selectedAnswer}
          >
            <Stack spacing={4}>
              {quizzes[currentQuizIndex]?.options?.map(
                (option, idx) => (
                  <Radio key={idx} value={option}>
                    {option}
                  </Radio>
                )
              )}
            </Stack>
          </RadioGroup>

          <Flex mt={6} justify="space-between">
            <Button
              colorScheme="teal"
              onClick={handlePrevious}
              isDisabled={currentQuizIndex === 0}
            >
              Previous
            </Button>

            {currentQuizIndex === quizzes.length - 1 ? (
              <Button
                colorScheme="teal"
                onClick={handleSubmitQuiz}
                isLoading={isSubmitting}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button colorScheme="teal" onClick={handleNext}>
                Next
              </Button>
            )}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
