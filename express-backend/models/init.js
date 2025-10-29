const db = require('../db/database');

// User/Admin table
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    rank TEXT,
    idNo TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    contactNo TEXT,
    presentAppointment TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    -- --- THIS IS THE CRITICAL FIX ---
    -- Add the two new columns to the table schema
    securityQuestion TEXT,
    securityAnswer TEXT
);`;

db.run(userTable);

// Guest Room Category table
const categoryTable = `CREATE TABLE IF NOT EXISTS guest_room_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);`;
db.run(categoryTable);

// Room table
const roomTable = `CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  categoryId INTEGER,
  name TEXT NOT NULL,
  managerName TEXT,
  managerContact TEXT,
  FOREIGN KEY (categoryId) REFERENCES guest_room_categories(id)
);`;
db.run(roomTable);

// Booking table
const bookingTable = `CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  rank TEXT,
  name TEXT,
  contactNo TEXT,
  presentAppointment TEXT,
  dateFrom TEXT,
  dateTo TEXT,
  checkInTime TEXT,
  checkOutTime TEXT,
  reason TEXT,
  guestRoomCategoryId INTEGER,
  numRooms INTEGER,
  numPeople INTEGER,
  status TEXT CHECK(status IN ('pending','approved','rejected','cancelled')),
  allottedRoomIds TEXT,
  allottedRoomNumbers TEXT,
  adminId INTEGER,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (guestRoomCategoryId) REFERENCES guest_room_categories(id),
  FOREIGN KEY (adminId) REFERENCES users(id)
);`;
db.run(bookingTable);

module.exports = db;
