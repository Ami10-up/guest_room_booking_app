require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());


require('./models/init'); // Initialize DB tables

// Import routes
app.use('/api/categories', require('./routes/category'));
app.use('/api/rooms', require('./routes/room'));
app.use('/api/bookings', require('./routes/booking'));

// Health check
app.get('/', (req, res) => res.send('Guest Room Booking API running'));


// Auth routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
