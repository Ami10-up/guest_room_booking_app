const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT id, name, allowedRank, locationUrl FROM guest_room_categories', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching categories' });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  // Get name, allowedRank and optional locationUrl from the request body
  const { name, allowedRank, locationUrl } = req.body;
  if (!name || !allowedRank) {
    return res.status(400).json({ message: 'Name and Allowed Rank are required' });
  }

  const sql = 'INSERT INTO guest_room_categories (name, allowedRank, locationUrl) VALUES (?, ?, ?)';
  const params = [name, allowedRank, locationUrl || null];

  db.run(sql, params, function(err) {
    if (err) {
      console.error("Database error creating category:", err.message);
      return res.status(500).json({ message: 'Error creating category' });
    }
    res.status(201).json({ id: this.lastID, name, allowedRank, locationUrl: locationUrl || null });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  // Get name, allowedRank and optional locationUrl from the request body
  const { name, allowedRank, locationUrl } = req.body;

  if (!name || !allowedRank) {
      return res.status(400).json({ message: 'Name and allowedRank are required.' });
  }

  db.run(
    'UPDATE guest_room_categories SET name = ?, allowedRank = ?, locationUrl = ? WHERE id = ?',
    [name, allowedRank, locationUrl || null, id],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error updating category' });
      res.json({ id, name, allowedRank, locationUrl: locationUrl || null });
    }
  );
};

// GET /api/categories/:id
exports.getById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT id, name, allowedRank, locationUrl FROM guest_room_categories WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Error fetching category' });
    if (!row) return res.status(404).json({ message: 'Category not found' });
    res.json(row);
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM guest_room_categories WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ message: 'Error deleting category' });
    res.json({ message: 'Deleted' });
  });
};
