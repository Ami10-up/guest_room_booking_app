const db = require('../db/database');

db.serialize(() => {
  db.all("PRAGMA table_info('users')", (err, rows) => {
    if (err) {
      console.error('Error fetching schema:', err.message);
      process.exit(1);
    }
    console.log('users table schema:');
    rows.forEach(r => console.log(`${r.cid}: ${r.name} (${r.type}) - notnull=${r.notnull} pk=${r.pk}`));
    process.exit(0);
  });
});
