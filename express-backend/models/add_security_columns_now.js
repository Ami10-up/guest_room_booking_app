const db = require('../db/database');

function columnExists(table, column, cb) {
  db.all(`PRAGMA table_info(${table})`, (err, rows) => {
    if (err) return cb(err);
    const exists = rows.some(r => r.name === column);
    cb(null, exists);
  });
}

function addColumn(table, columnDef, cb) {
  db.run(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`, (err) => cb(err));
}

columnExists('users', 'securityQuestion', (err, exists1) => {
  if (err) return console.error('Error checking securityQuestion:', err.message);
  columnExists('users', 'securityAnswer', (err, exists2) => {
    if (err) return console.error('Error checking securityAnswer:', err.message);

    if (exists1 && exists2) {
      console.log('Both columns already exist.');
      process.exit(0);
    }

    if (!exists1) {
      addColumn('users', "securityQuestion TEXT", (err) => {
        if (err) console.error('Failed to add securityQuestion:', err.message);
        else console.log('Added securityQuestion column');
      });
    }

    if (!exists2) {
      addColumn('users', "securityAnswer TEXT", (err) => {
        if (err) console.error('Failed to add securityAnswer:', err.message);
        else console.log('Added securityAnswer column');
      });
    }

    // Wait briefly for operations to finish before printing schema
    setTimeout(() => {
      db.all("PRAGMA table_info('users')", (err, rows) => {
        if (err) return console.error('Error fetching schema:', err.message);
        console.log('Updated users table schema:');
        rows.forEach(r => console.log(`${r.cid}: ${r.name} (${r.type}) - notnull=${r.notnull} pk=${r.pk}`));
        process.exit(0);
      });
    }, 500);
  });
});
