// express-backend/controllers/bookingController.js

const db = require('../db/database');

// GET all bookings for the currently authenticated user
// In express-backend/controllers/bookingController.js

// In express-backend/controllers/bookingController.js

// In express-backend/controllers/bookingController.js

// --- THIS IS THE FINAL, CORRECT 'getAll' METHOD ---
exports.getAll = (req, res) => {
  // Get the logged-in user's info from the JWT token
  const user = req.user;

  let sql;
  let params = [];

  // If the user making the request IS an admin, get ALL bookings.
  if (user.role === 'admin') {
    sql = `SELECT b.*, c.name as guestHouseName FROM bookings b LEFT JOIN guest_room_categories c ON b.guestRoomCategoryId = c.id ORDER BY b.id DESC`;
  } 
  // --- USER VIEW ---
  // Users will still see their own bookings, including cancelled ones.
  else {
    sql = `SELECT b.*, c.name as guestHouseName FROM bookings b LEFT JOIN guest_room_categories c ON b.guestRoomCategoryId = c.id WHERE b.userId = ? ORDER BY b.id DESC`;
    params.push(user.id);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching bookings' });
    res.json(rows);
  });
};

// POST a new booking request
// In express-backend/controllers/bookingController.js
exports.create = (req, res) => {
  // Destructure ALL fields from the request body, including remarks
  const { 
    userId, rank, name, contactNo, presentAppointment, idNo, dateFrom, dateTo, 
    checkInTime, checkOutTime, reason, remarks, guestRoomCategoryId, numRooms, numPeople 
  } = req.body;

  if (!userId || !dateFrom || !dateTo || !guestRoomCategoryId || !numRooms) {
    return res.status(400).json({ message: 'Missing required fields for booking' });
  }

  // The SQL query now correctly includes the 'remarks' column
  const sql = `INSERT INTO bookings (
    userId, rank, name, contactNo, presentAppointment, idNo, dateFrom, dateTo, 
    checkInTime, checkOutTime, reason, remarks, guestRoomCategoryId, numRooms, numPeople, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // The parameters array now correctly includes the remarks variable
  const params = [
    userId, rank, name, contactNo, presentAppointment, idNo, dateFrom, dateTo,
    checkInTime, checkOutTime, reason, remarks, guestRoomCategoryId, numRooms, numPeople, 'pending'
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error("Database error creating booking:", err.message);
      return res.status(500).json({ message: 'Error creating booking' });
    }
    // Fetch the newly created booking to send back to the app (for the PDF)
    db.get("SELECT * FROM bookings WHERE id = ?", [this.lastID], (err, newBooking) => {
        if (err) return res.status(500).json({ message: 'Could not fetch new booking.'});
        res.status(201).json(newBooking);
    });
  });
};

// PUT (update) a booking's status to 'cancelled'
exports.cancelBooking = (req, res) => {
  const bookingId = req.params.id;
  const requestingUser = req.user; // User from the token

  db.get("SELECT userId, status FROM bookings WHERE id = ?", [bookingId], (err, booking) => {
    if (err) return res.status(500).json({ message: "Server error checking booking." });
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    // Security Check: Allow if user is the owner OR is an admin
    if (booking.userId !== requestingUser.id && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: You do not have permission to cancel this booking." });
    }

    let newStatus = '';
    if (booking.status === 'pending') {
      newStatus = 'cancelled';
    } else if (booking.status === 'approved') {
      newStatus = 'cancellation_pending';
    } else {
      return res.status(400).json({ message: `Cannot process cancellation for a booking with status: ${booking.status}` });
    }

    db.run("UPDATE bookings SET status = ? WHERE id = ?", [newStatus, bookingId], function(err) {
      if (err) return res.status(500).json({ message: 'Error updating booking status.' });
      res.status(200).json({ message: `Booking status updated to ${newStatus}.` });
    });
  });
};

// --- CORRECTED updateStatus METHOD ---
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status, allottedRoomNumbers, guestRoomCategoryId } = req.body;
  const adminId = req.user.id; // This user MUST be an admin (checked by middleware)

  let sql = 'UPDATE bookings SET status = ?, adminId = ?';
  let params = [status, adminId];

  if (status === 'approved') {
    if (!allottedRoomNumbers || !guestRoomCategoryId) {
      return res.status(400).json({ message: "Room allotment and category are required to approve." });
    }
    sql += ', allottedRoomNumbers = ?, guestRoomCategoryId = ?';
    params.push(allottedRoomNumbers.join(', '), guestRoomCategoryId);
  } else if (status === 'cancelled') {
    // If admin confirms cancellation, free up the rooms
    sql += ', allottedRoomNumbers = NULL';
  }
  
  sql += ' WHERE id = ?';
  params.push(id);

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ message: 'Error updating status' });
    if (this.changes === 0) return res.status(404).json({ message: "Booking not found." });
    res.json({ message: "Booking status updated successfully." });
  });
};


// Admin-only method to update status to approved/rejected
// In express-backend/controllers/bookingController.js

// PUT (update) the status of a booking (admin only)
// In express-backend/controllers/bookingController.js

// In express-backend/controllers/bookingController.js

exports.updateStatus = (req, res) => {
  // --- START DEBUG LOGGING ---
  console.log('\n--- Received request to update booking status ---');
  console.log('Booking ID (from URL params):', req.params.id);
  console.log('Request Body (from frontend):', req.body);
  console.log('------------------------------------------------');
  // --- END DEBUG LOGGING ---

  const { id } = req.params;
  const { status, allottedRoomNumbers, guestRoomCategoryId } = req.body;
  const adminId = req.user.id;

  if (!status) {
    return res.status(400).json({ message: "Status is a required field." });
  }

  // (The rest of the function logic remains the same)
  let sql = 'UPDATE bookings SET status = ?, adminId = ?';
  let params = [status, adminId];
  if (status === 'approved') {
    if (!allottedRoomNumbers || !guestRoomCategoryId) {
      return res.status(400).json({ message: "Room allotment and category are required to approve." });
    }
    sql += ', allottedRoomNumbers = ?, guestRoomCategoryId = ?';
    params.push(allottedRoomNumbers.join(', '), guestRoomCategoryId);
  }
  sql += ' WHERE id = ?';
  params.push(id);

  db.run(sql, params, function(err) {
    if (err) {
      console.error("Database error updating status:", err.message);
      return res.status(500).json({ message: 'Error updating status' });
    }
    if (this.changes === 0) {
        return res.status(404).json({ message: "Booking not found." });
    }
    console.log('--- Booking status updated successfully in DB ---');
    res.json({ message: "Booking status updated successfully." });
  });
};

// Admin-only method to delete a booking
exports.delete = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM bookings WHERE id = ?', [id], function(err) {
    if (err) {
      console.error("Database error deleting booking:", err.message);
      return res.status(500).json({ message: 'Error deleting booking' });
    }
    res.json({ message: 'Booking deleted successfully' });
  });
};

// Placeholder for vacancy check
// In express-backend/controllers/bookingController.js

// ... (getAll, create, cancelBooking, etc. methods are above this) ...

// GET /api/bookings/vacancy?categoryId=1&dateFrom=2025-08-27&dateTo=2025-08-29
exports.checkVacancy = (req, res) => {
    const { categoryId, dateFrom, dateTo } = req.query;

    if (!categoryId || !dateFrom || !dateTo) {
        return res.status(400).json({ message: "Missing required query parameters for vacancy check." });
    }

    db.get('SELECT COUNT(id) as totalRooms FROM rooms WHERE categoryId = ?', [categoryId], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error fetching total rooms' });
        if (!row) return res.status(404).json({ message: 'Category not found' });
        
        const totalRooms = row.totalRooms;

        const sql = `
            SELECT SUM(numRooms) as occupiedRooms 
            FROM bookings 
            WHERE guestRoomCategoryId = ? 
            AND status = 'approved' 
            AND dateFrom < ? 
            AND dateTo > ?`;

        db.get(sql, [categoryId, dateTo, dateFrom], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error checking occupied rooms' });
            
            const occupiedRooms = result.occupiedRooms || 0;
            const availableRooms = totalRooms - occupiedRooms;
            
            res.status(200).json({ availableRooms });
        });
    });
};
// In express-backend/controllers/bookingController.js

// In express-backend/controllers/bookingController.js

// In express-backend/controllers/bookingController.js

// ... (Your other controller functions) ...

// --- THIS IS THE COMPLETE AND CORRECTED FUNCTION ---
exports.getOccupancyByDateRange = (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    const bookingsSql = `
        SELECT 
            id as bookingId, status, dateFrom, dateTo, name as guestName,
            allottedRoomNumbers, guestRoomCategoryId
        FROM bookings
        WHERE 
            dateFrom < ? AND dateTo > ?
            AND status IN ('pending', 'approved')
    `;

    db.all(bookingsSql, [endDate, startDate], (err, bookings) => {
        if (err) {
            console.error("Database error fetching date range bookings:", err.message);
            return res.status(500).json({ message: 'Error fetching booking data' });
        }
        
        // This is the second part of the logic that was missing.
        // It fetches all the rooms to build the complete grid.
        const roomsSql = `
            SELECT r.id, r.name, c.name as categoryName, c.id as categoryId 
            FROM rooms r 
            JOIN guest_room_categories c ON r.categoryId = c.id 
            ORDER BY c.id, r.id`;

        db.all(roomsSql, [], (err, allRooms) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching all rooms' });
            }
            
            // --- THIS IS THE CRUCIAL MISSING STEP ---
            // Send both the bookings and the rooms back to the frontend in a single JSON response.
            res.json({
                bookings: bookings,
                allRooms: allRooms
            });
        });
    });
};
