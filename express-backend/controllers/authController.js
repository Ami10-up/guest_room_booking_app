const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.register = (req, res) => {
  const { fullName, rank, idNo, username, password, contactNo, presentAppointment, role } = req.body;
  if (!fullName || !idNo || !username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  db.get('SELECT * FROM users WHERE username = ? OR idNo = ?', [username, idNo], (err, user) => {
    if (user) return res.status(409).json({ message: 'Username or ID No. already exists' });
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });
      db.run('INSERT INTO users (fullName, rank, idNo, username, password, contactNo, presentAppointment, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [fullName, rank, idNo, username, hash, contactNo, presentAppointment, role],
        function (err) {
          if (err) return res.status(500).json({ message: 'Registration failed' });
          res.status(201).json({ id: this.lastID, username, role });
        }
      );
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });
    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) return res.status(401).json({ message: 'Invalid username or password' });
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName } });
    });
  });
};

exports.logout = (req, res) => {
  // For stateless JWT, logout is handled on client side
  res.json({ message: 'Logged out' });
};
