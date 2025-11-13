const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const bookRoutes = require('./routes/books'); 
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins temporarily
}));

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


// Vercel serverless export

module.exports = app;
module.exports.handler = serverless(app);
