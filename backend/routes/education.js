const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Education = require('../models/Education');

// Ensure the 'upload' directory exists
const uploadDir = path.join(__dirname, '../upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  const { title, description, category } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  try {
    const newContent = new Education({
      title,
      description,
      category,
      file: req.file.filename, // Store only the filename
    });

    await newContent.save();
    res.status(201).json({ message: 'Educational content uploaded successfully', newContent });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: 'Failed to upload content' });
  }
});

// Get all educational content
router.get('/', async (req, res) => {
  try {
    const content = await Education.find();
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch educational content' });
  }
});

// Download file by ID
router.get('/download/:id', async (req, res) => {
  try {
    const content = await Education.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const filePath = path.join(uploadDir, content.file);
    res.download(filePath);
  } catch (error) {
    res.status(400).json({ error: 'Failed to download content' });
  }
});

// Delete educational content
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Education.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Delete the file from the server
    const filePath = path.join(uploadDir, deleted.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

module.exports = router;
