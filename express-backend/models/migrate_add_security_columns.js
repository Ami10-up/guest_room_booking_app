// Migration script to add securityQuestion and securityAnswer columns to users table
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../db/guestroom.sqlite');
const db = new sqlite3.Database(dbPath);

function addColumnIfNotExists(table, column, type) {
  db.get(`PRAGMA table_info(${table})`, (err, info) => {
    if (err) throw err;
    db.all(`PRAGMA table_info(${table})`, (err, columns) => {
      if (err) throw err;
      const exists = columns.some(col => col.name === column);
      if (!exists) {
        db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`, err => {
          if (err) throw err;
          console.log(`Added column ${column} to ${table}`);
        });
      } else {
        console.log(`Column ${column} already exists in ${table}`);
      }
    });
  });
}

addColumnIfNotExists('users', 'securityQuestion', 'TEXT');
addColumnIfNotExists('users', 'securityAnswer', 'TEXT');

db.close();
