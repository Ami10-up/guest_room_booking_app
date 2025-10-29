// express-backend/db/init.js

const db = require('./database.js');

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
    role TEXT NOT NULL DEFAULT 'user'
);`;

const createCategoriesTable = `
CREATE TABLE IF NOT EXISTS guest_room_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    allowedRank TEXT NOT NULL
);`;

const createRoomsTable = `
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryId INTEGER NOT NULL,
    name TEXT NOT NULL,
    managerName TEXT,
    managerContact TEXT,
    FOREIGN KEY (categoryId) REFERENCES guest_room_categories (id) ON DELETE CASCADE
);`;

// --- VERIFIED AND CORRECT SCHEMA FOR THE 'bookings' TABLE ---
const createBookingsTable = `
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    rank TEXT,
    name TEXT,
    contactNo TEXT,
    presentAppointment TEXT,
    idNo TEXT,
    dateFrom TEXT NOT NULL,
    dateTo TEXT NOT NULL,
    checkInTime TEXT,
    checkOutTime TEXT,
    reason TEXT,
    remarks TEXT, -- <<< ADD THIS LINE
    guestRoomCategoryId INTEGER NOT NULL,
    numRooms INTEGER NOT NULL,
    numPeople INTEGER,
    status TEXT NOT NULL DEFAULT 'pending',
    allottedRoomNumbers TEXT,
    adminId INTEGER,
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (guestRoomCategoryId) REFERENCES guest_room_categories (id)
);`;



db.serialize(() => {
    db.run(createUsersTable, (err) => { if (err) console.error("Error creating users table:", err.message); else console.log("Users table is ready."); });
    db.run(createCategoriesTable, (err) => { if (err) console.error("Error creating categories table:", err.message); else console.log("Categories table is ready."); });
    db.run(createRoomsTable, (err) => { if (err) console.error("Error creating rooms table:", err.message); else console.log("Rooms table is ready."); });
    db.run(createBookingsTable, (err) => { if (err) console.error("Error creating bookings table:", err.message); else console.log("Bookings table is ready."); });

    db.get("SELECT COUNT(*) as count FROM guest_room_categories", (err, row) => {
        if (row && row.count === 0) {
            console.log("No categories found. Seeding initial guest houses...");
            const categories = [
                { name: 'Officer Guest House 1', rank: 'Officer' },
                { name: 'Officer Guest House 2', rank: 'Officer' },
                { name: 'Officer Guest House 3', rank: 'Officer' },
                // JCO and OR categories have been removed
            ];

            const stmt = db.prepare("INSERT INTO guest_room_categories (name, allowedRank) VALUES (?, ?)");
            categories.forEach(cat => stmt.run(cat.name, cat.rank));
            stmt.finalize((err) => {
                if (!err) {
                    console.log("Successfully seeded guest house categories.");
                    seedRooms();
                }
            });
        }
    });
});

function seedRooms() {
    db.get("SELECT COUNT(*) as count FROM rooms", (err, row) => {
        if (row && row.count === 0) {
            console.log("No rooms found. Seeding initial rooms...");
            db.all("SELECT id, name FROM guest_room_categories", [], (err, categories) => {
                if (err) return console.error("Could not fetch categories to seed rooms");
                
                const roomStmt = db.prepare("INSERT INTO rooms (categoryId, name, managerName, managerContact) VALUES (?, ?, ?, ?)");
                categories.forEach(cat => {
                    for (let i = 1; i <= 10; i++) {
                        roomStmt.run(cat.id, `Room ${i}`, 'Default Manager', '0000000000');
                    }
                });
                roomStmt.finalize(() => console.log("Successfully seeded rooms."));
            });
        }
    });
}

module.exports = db;