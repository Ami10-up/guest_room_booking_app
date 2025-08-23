const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT rooms.*, guest_room_categories.name as categoryName FROM rooms LEFT JOIN guest_room_categories ON rooms.categoryId = guest_room_categories.id', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching rooms' });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { categoryId, name, managerName, managerContact } = req.body;
  if (!categoryId || !name) return res.status(400).json({ message: 'Missing required fields' });
  db.run('INSERT INTO rooms (categoryId, name, managerName, managerContact) VALUES (?, ?, ?, ?)', [categoryId, name, managerName, managerContact], function(err) {
    if (err) return res.status(500).json({ message: 'Error creating room' });
    res.status(201).json({ id: this.lastID, categoryId, name, managerName, managerContact });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { categoryId, name, managerName, managerContact } = req.body;
  db.run('UPDATE rooms SET categoryId = ?, name = ?, managerName = ?, managerContact = ? WHERE id = ?', [categoryId, name, managerName, managerContact, id], function(err) {
    if (err) return res.status(500).json({ message: 'Error updating room' });
    res.json({ id, categoryId, name, managerName, managerContact });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM rooms WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ message: 'Error deleting room' });
    res.json({ message: 'Deleted' });
  });
};
