// express-backend/app.js

const express = require('express');
const dotenv = require('dotenv');
// --- 1. IMPORT THE CORS MIDDLEWARE ---
const cors = require('cors');

dotenv.config();
require('./db/init.js');

const authRoutes = require('./routes/auth.js');
const bookingRoutes = require('./routes/booking.js');
const categoryRoutes = require('./routes/category.js');
const roomRoutes = require('./routes/room.js');

const app = express();

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`);
  next();
});

// --- 2. USE THE CORS MIDDLEWARE ---
// This line tells your server to add the necessary headers to all responses,
// allowing your React frontend to communicate with it.
// It MUST be placed before your routes.
app.use(cors({
  origin: '*', // Allow any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
  // Explicitly allow the browser to send these headers with requests
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
}));

// This middleware allows the server to parse incoming JSON data
app.use(express.json());

// Handle invalid JSON payload errors thrown by express.json()
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', err.message);
    return res.status(400).json({ message: 'Invalid JSON payload', error: err.message });
  }
  next(err);
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Atithi Bhavan Backend API!');
});

// Health endpoint for quick checks (ngrok/curl)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});

// Global error handler - ensure we always return JSON for errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Internal server error', error: err ? (err.message || String(err)) : '' });
});

// Catch unhandled promise rejections and uncaught exceptions to keep logs
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});