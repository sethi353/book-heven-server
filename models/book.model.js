const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userName: String,
  userPhoto: String,
  text: String,
}, { timestamps: true });

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  rating: { type: Number, min: 1, max: 5 },
  summary: String,
  coverImage: String,
  userEmail: String,
  userName: String,
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
