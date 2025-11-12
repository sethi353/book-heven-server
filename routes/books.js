// routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// =========================
// 1️⃣ Latest 6 books
// Must be before '/:id' route
router.get('/latest', async (req, res) => {
  try {
    const latestBooks = await Book.find().sort({ createdAt: -1 }).limit(6);
    res.json(latestBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =========================
// 2️⃣ All books (optional query params: ?sortBy=rating&order=desc&limit=6)
router.get('/', async (req, res) => {
  try {
    const { sortBy, order = 'desc', limit } = req.query;
    let query = Book.find();

    if (sortBy) {
      const sortObj = {};
      sortObj[sortBy] = order === 'asc' ? 1 : -1;
      query = query.sort(sortObj);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    if (limit) query = query.limit(parseInt(limit));

    const books = await query.exec();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =========================
// 3️⃣ Single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =========================
// 4️⃣ Create new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request', details: err.message });
  }
});

// =========================
// 5️⃣ Update book
router.put('/:id', async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request' });
  }
});

// =========================
// 6️⃣ Delete book
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Book.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request' });
  }
});

// =========================
// 7️⃣ Add comment to a book
router.post('/:id/comments', async (req, res) => {
  try {
    const { userName, userPhoto, text } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (!book.comments) book.comments = [];
    book.comments.push({ userName, userPhoto, text });
    await book.save();

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request' });
  }
});

module.exports = router;
