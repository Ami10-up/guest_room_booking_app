const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.register = (req, res) => {
  const { 
    fullName, rank, idNo, username, password, contactNo, 
    presentAppointment, securityQuestion, securityAnswer, role 
  } = req.body;
  
  // Validation
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "Invalid username. No spaces or special characters allowed." });
  }
  if (!fullName || !idNo || !username || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  // 1. Check if user already exists
  db.get('SELECT * FROM users WHERE username = ? OR idNo = ?', [username, idNo], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (user) return res.status(409).json({ message: 'Username or ID No. already exists' });

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });

      // --- FIX: The SQL query now includes all required columns ---
      const sql = 'INSERT INTO users (fullName, rank, idNo, username, password, contactNo, presentAppointment, role, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      
      // --- FIX: The parameters array now includes all corresponding values ---
      const params = [fullName, rank, idNo, username, hash, contactNo, presentAppointment, role || 'user', securityQuestion, securityAnswer];
      db.run(sql, params, function (err) {
          if (err) {
              console.error("Database error during registration:", err && err.message ? err.message : err);
              const resp = { message: 'Registration failed' };
              // Expose DB error message in non-production for debugging
              if (process.env.NODE_ENV !== 'production') resp.error = err && (err.message || String(err));
              return res.status(500).json(resp);
          }
          res.status(201).json({ id: this.lastID, message: "User registered successfully!" });
        }
      );
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
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
exports.getSecurityQuestion = (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username is required." });
    
    db.get("SELECT securityQuestion FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ message: "Server error." });
        if (!user || !user.securityQuestion) {
            return res.status(404).json({ message: "User not found or no security question is set." });
        }
        res.json({ securityQuestion: user.securityQuestion });
    });
};

// --- NEW 'resetPassword' FUNCTION ---
exports.resetPassword = (req, res) => {
    const { username, securityAnswer, newPassword } = req.body;
    if (!username || !securityAnswer || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    db.get("SELECT securityAnswer FROM users WHERE username = ?", [username], (err, user) => {
        if (err || !user) return res.status(404).json({ message: "User not found." });

        // IMPORTANT: In a real app, you would hash the security answer too!
        // For simplicity here, we are comparing plain text.
        if (user.securityAnswer !== securityAnswer) {
            return res.status(401).json({ message: "Incorrect security answer." });
        }

        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing new password' });
            db.run("UPDATE users SET password = ? WHERE username = ?", [hash, username], function(err) {
                if (err) return res.status(500).json({ message: "Failed to update password." });
                res.status(200).json({ message: "Password has been reset successfully." });
            });
        });
    });
};