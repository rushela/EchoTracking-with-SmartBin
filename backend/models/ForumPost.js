const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  question: { type: String, required: true },
  response: { type: String },
  askedBy: { type: String, required: true },  // simplified
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumPost', forumSchema);
