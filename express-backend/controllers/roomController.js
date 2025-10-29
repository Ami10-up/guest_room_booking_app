// express-backend/controllers/roomController.js

const db = require('../db/database');

// GET all rooms, joined with their category name for easier display
exports.getAll = (req, res) => {
  const sql = `
    SELECT 
      r.id, r.categoryId, r.name, r.managerName, r.managerContact,
      c.name as categoryName 
    FROM 
      rooms r 
    LEFT JOIN 
      guest_room_categories c ON r.categoryId = c.id
    ORDER BY r.id`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database error fetching rooms:", err.message);
      return res.status(500).json({ message: 'Error fetching rooms' });
    }
    res.json(rows);
  });
};

// POST (create) a new room
exports.create = (req, res) => {
  const { categoryId, name, managerName, managerContact } = req.body;
  if (!categoryId || !name) {
    return res.status(400).json({ message: 'Category ID and Room Name are required.' });
  }
  const sql = 'INSERT INTO rooms (categoryId, name, managerName, managerContact) VALUES (?, ?, ?, ?)';
  db.run(sql, [categoryId, name, managerName, managerContact], function(err) {
    if (err) {
      console.error("Database error creating room:", err.message);
      return res.status(500).json({ message: 'Error creating room' });
    }
    res.status(201).json({ id: this.lastID });
  });
};

// PUT (update) an existing room
exports.update = (req, res) => {
  const { id } = req.params;
  const { categoryId, name, managerName, managerContact } = req.body;
  if (!categoryId || !name) {
    return res.status(400).json({ message: 'Category ID and Room Name are required.' });
  }

  // The SQL query now correctly includes 'managerContact = ?'
  const sql = 'UPDATE rooms SET categoryId = ?, name = ?, managerName = ?, managerContact = ? WHERE id = ?';
  
  // The parameters array now correctly includes the managerContact variable
  const params = [categoryId, name, managerName, managerContact, id];

  db.run(sql, params, function(err) {
    if (err) {
      console.error("Database error updating room:", err.message);
      return res.status(500).json({ message: 'Error updating room' });
    }
    res.json({ message: 'Room updated successfully.' });
  });
};

// DELETE a room
exports.delete = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM rooms WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      console.error("Database error deleting room:", err.message);
      return res.status(500).json({ message: 'Error deleting room' });
    }
    res.json({ message: 'Room deleted successfully' });
  });
};

// GET the current occupancy status of all rooms for today


// --- FINAL, CORRECTED AVAILABLE ROOMS METHOD ---
// In express-backend/controllers/roomController.js

// --- THIS IS THE COMPLETE AND CORRECTED FUNCTION ---
exports.getAvailableRoomsForBooking = (req, res) => {
    const { categoryId, dateFrom, dateTo } = req.query;
    if (!categoryId || !dateFrom || !dateTo) {
        return res.status(400).json({ message: "Missing required parameters." });
    }

    // Step 1: Get ALL rooms that belong to the requested category.
    const allRoomsSql = `SELECT id, name FROM rooms WHERE categoryId = ?`;
    db.all(allRoomsSql, [categoryId], (err, allRooms) => {
        if (err) {
            console.error("Step 1 FAILED - Get All Rooms:", err.message);
            return res.status(500).json({ message: 'Error fetching rooms' });
        }
        if (allRooms.length === 0) {
            return res.json([]); // No rooms in this category, return empty
        }

        // Step 2: Get ALL approved bookings in this category that overlap with the requested dates.
        const overlappingBookingsSql = `
            SELECT allottedRoomNumbers 
            FROM bookings 
            WHERE 
                status = 'approved' 
                AND guestRoomCategoryId = ? 
                AND dateFrom < ? 
                AND dateTo > ?`;
        
        // --- THIS IS THE MISSING LOGIC ---
        db.all(overlappingBookingsSql, [categoryId, dateTo, dateFrom], (err, bookings) => {
            if (err) {
                console.error("Step 2 FAILED - Get Overlapping Bookings:", err.message);
                return res.status(500).json({ message: 'Error fetching bookings' });
            }

            // Step 3: Create a set of all occupied room names.
            let occupiedRoomNames = new Set();
            bookings.forEach(booking => {
                if (booking.allottedRoomNumbers) {
                    const rooms = booking.allottedRoomNumbers.split(',').map(name => name.trim());
                    rooms.forEach(roomName => occupiedRoomNames.add(roomName));
                }
            });
            
            // Step 4: Filter the original list of rooms, keeping only the available ones.
            const availableRooms = allRooms.filter(room => !occupiedRoomNames.has(room.name));
            
            // Step 5: Send the final, correct list of available rooms as the response.
            res.json(availableRooms);
        });
        // --- END OF MISSING LOGIC ---
    });
};
  exports.getManagerForCategory = (req, res) => {
    const { categoryId } = req.params;
    const sql = `SELECT managerName, managerContact FROM rooms WHERE categoryId = ? LIMIT 1`;
    db.get(sql, [categoryId], (err, row) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!row) return res.status(404).json({ message: "Manager not found" });
        res.json(row);
    });
};