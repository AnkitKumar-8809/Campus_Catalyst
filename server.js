const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === Email format validation ===
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// === REGISTER ===
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const checkUser = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUser, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const insertUser = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertUser, [name, email, password], (err) => {
      if (err) return res.status(500).json({ message: 'Registration failed' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// === LOGIN ===
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required' });
  }

  const loginQuery = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(loginQuery, [email, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Login failed' });

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result[0];
    res.status(200).json({
      message: 'Login successful',
      name: user.name,
      email: user.email,
      created_at: user.created_at || null  // Optional: if your DB table has `created_at`
    });
  });
});

// === Contact Form ===
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields required' });
  }
  console.log('📨 Contact form submitted:', name, email, message);
  res.status(200).json({ message: 'Message received. Thank you!' });
});

// === Start Server ===
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
