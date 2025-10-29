const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM guest_room_categories', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching categories' });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  // Get both name and allowedRank from the request body
  const { name, allowedRank } = req.body;
  if (!name || !allowedRank) {
    return res.status(400).json({ message: 'Name and Allowed Rank are required' });
  }

  // The SQL query now includes both columns
  const sql = 'INSERT INTO guest_room_categories (name, allowedRank) VALUES (?, ?)';
  const params = [name, allowedRank];

  db.run(sql, params, function(err) {
    if (err) {
      console.error("Database error creating category:", err.message);
      return res.status(500).json({ message: 'Error creating category' });
    }
    res.status(201).json({ id: this.lastID, name, allowedRank });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  // Get both name and allowedRank from the request body
  const { name, allowedRank } = req.body;

  if (!name || !allowedRank) {
      return res.status(400).json({ message: 'Name and allowedRank are required.' });
  }

  db.run(
    'UPDATE guest_room_categories SET name = ?, allowedRank = ? WHERE id = ?',
    [name, allowedRank, id],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error updating category' });
      res.json({ id, name, allowedRank });
    }
  );
};

exports.delete = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM guest_room_categories WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ message: 'Error deleting category' });
    res.json({ message: 'Deleted' });
  });
};
