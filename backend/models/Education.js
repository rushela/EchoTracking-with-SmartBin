const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  file: { type: String, required: true },  // Path to the uploaded file
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User that uploaded the content
  dateUploaded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EducationalContent', educationSchema);