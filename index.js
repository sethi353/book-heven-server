const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const bookRoutes = require('./routes/books'); 

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));



app.get('/', (req, res) => {
  res.send(" Welcome to the Book API — use /api/books to view all books");
});

// Routes
app.use('/api/books', bookRoutes);

// Test route
app.get('/test', (req, res) => res.send(" Backend working"));

// Catch-all 404
app.use((req, res) => res.status(404).send("Route not found"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
