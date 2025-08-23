const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM guest_room_categories', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching categories' });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  db.run('INSERT INTO guest_room_categories (name) VALUES (?)', [name], function(err) {
    if (err) return res.status(500).json({ message: 'Error creating category' });
    res.status(201).json({ id: this.lastID, name });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.run('UPDATE guest_room_categories SET name = ? WHERE id = ?', [name, id], function(err) {
    if (err) return res.status(500).json({ message: 'Error updating category' });
    res.json({ id, name });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM guest_room_categories WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ message: 'Error deleting category' });
    res.json({ message: 'Deleted' });
  });
};
