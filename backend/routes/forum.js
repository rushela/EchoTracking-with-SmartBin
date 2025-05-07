// routes/forum.js
const express = require('express');
const ForumPost = require('../models/ForumPost'); // Make sure the path is correct
const router = express.Router();
// const toast = useToast();



// POST: Ask a question
router.post('/', async (req, res) => {
  const { question, role } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (role !== 'resident') {
    return res.status(403).json({ message: 'Only residents can ask questions' });
  }

  try {
    const newPost = new ForumPost({
      question,
      askedBy: 'Resident', // You can replace with dynamic userId if needed
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('❌ Error while posting question:', error);
    res.status(400).json({ error: 'Failed to post question' });
  }
});

// GET: View all forum posts (Public access)
router.get('/', async (req, res) => {
  try {
    const posts = await ForumPost.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('❌ Error fetching forum posts:', error);
    res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
});

// PUT: Answer a question
router.put('/:id/answer', async (req, res) => {
  const { response, role } = req.body;

  if (role !== 'environmentalist') {
    return res.status(403).json({ message: 'Only environmentalists can answer questions' });
  }

  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Forum post not found' });
    }

    post.response = response;
    await post.save();

    res.status(200).json({ message: 'Answer added successfully', post });
  } catch (error) {
    console.error('❌ Error answering forum post:', error.message);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

// PUT: Update an existing answer
router.put('/:id/update-answer', async (req, res) => {
  const { response, role } = req.body;

  if (role !== 'environmentalist') {
    return res.status(403).json({ message: 'Only environmentalists can update answers' });
  }

  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Forum post not found' });
    }

    if (!post.response) {
      return res.status(400).json({ message: 'No existing answer to update' });
    }

    post.response = response;
    await post.save();

    res.status(200).json({ message: 'Answer updated successfully', post });
  } catch (error) {
    console.error('❌ Error updating answer:', error.message);
    res.status(500).json({ error: 'Failed to update answer' });
  }
});

// DELETE: Delete a question
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await ForumPost.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    console.error('❌ Error deleting forum post:', error.message);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

module.exports = router;
