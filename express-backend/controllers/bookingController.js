const db = require('../db/database');

// Helper: Check vacancy for a category and date range
function checkVacancy(categoryId, dateFrom, dateTo, numRooms, callback) {
  db.all('SELECT id FROM rooms WHERE categoryId = ?', [categoryId], (err, rooms) => {
    if (err) return callback(err);
    const roomIds = rooms.map(r => r.id);
    if (roomIds.length < numRooms) return callback(null, false, []);
    db.all(`SELECT allottedRoomIds, dateFrom, dateTo FROM bookings WHERE guestRoomCategoryId = ? AND status IN ('pending','approved') AND ((dateFrom <= ? AND dateTo >= ?) OR (dateFrom <= ? AND dateTo >= ?))`, [categoryId, dateTo, dateFrom, dateFrom, dateTo], (err, bookings) => {
      if (err) return callback(err);
      let bookedRoomIds = [];
      bookings.forEach(b => {
        if (b.allottedRoomIds) bookedRoomIds.push(...b.allottedRoomIds.split(',').map(Number));
      });
      const available = roomIds.filter(id => !bookedRoomIds.includes(id));
      callback(null, available.length >= numRooms, available.slice(0, numRooms));
    });
  });
}

exports.getAll = (req, res) => {
  db.all('SELECT * FROM bookings', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching bookings' });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { userId, rank, name, contactNo, presentAppointment, dateFrom, dateTo, checkInTime, checkOutTime, reason, guestRoomCategoryId, numRooms, numPeople } = req.body;
  if (!userId || !dateFrom || !dateTo || !guestRoomCategoryId || !numRooms) return res.status(400).json({ message: 'Missing required fields' });
  checkVacancy(guestRoomCategoryId, dateFrom, dateTo, numRooms, (err, isAvailable, roomIds) => {
    if (err) return res.status(500).json({ message: 'Error checking vacancy' });
    if (!isAvailable) return res.status(409).json({ message: 'Not enough rooms available' });
    db.run('INSERT INTO bookings (userId, rank, name, contactNo, presentAppointment, dateFrom, dateTo, checkInTime, checkOutTime, reason, guestRoomCategoryId, numRooms, numPeople, status, allottedRoomIds, allottedRoomNumbers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, rank, name, contactNo, presentAppointment, dateFrom, dateTo, checkInTime, checkOutTime, reason, guestRoomCategoryId, numRooms, numPeople, 'pending', roomIds.join(','), null],
      function(err) {
        if (err) return res.status(500).json({ message: 'Error creating booking' });
        res.status(201).json({ id: this.lastID });
      }
    );
  });
};

exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status, adminId } = req.body;
  db.run('UPDATE bookings SET status = ?, adminId = ? WHERE id = ?', [status, adminId, id], function(err) {
    if (err) return res.status(500).json({ message: 'Error updating status' });
    res.json({ id, status });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM bookings WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ message: 'Error deleting booking' });
    res.json({ message: 'Deleted' });
  });
};

exports.checkVacancy = (req, res) => {
  const { categoryId, dateFrom, dateTo, numRooms } = req.query;
  checkVacancy(categoryId, dateFrom, dateTo, Number(numRooms), (err, isAvailable, availableRoomIds) => {
    if (err) return res.status(500).json({ message: 'Error checking vacancy' });
    res.json({ isAvailable, availableRoomIds });
  });
};
