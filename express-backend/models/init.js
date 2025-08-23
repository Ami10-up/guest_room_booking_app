const db = require('../db/database');

// User/Admin table
const userTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT NOT NULL,
  rank TEXT,
  idNo TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  contactNo TEXT,
  presentAppointment TEXT,
  role TEXT NOT NULL CHECK(role IN ('user', 'admin'))
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
