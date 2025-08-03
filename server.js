const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db'); // MongoDB connection
const User = require('./models/User'); // Mongoose User model
const Contact = require('./models/Contact'); // ⬅ Contact model

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB(); // connect to MongoDB

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// === REGISTER ===
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// === LOGIN ===
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required' });
  }

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      name: user.name,
      email: user.email,
      created_at: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// === CONTACT ===
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Message received. Thank you!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save message' });
  }
});

const express = require('express');
const User = require('./models/User');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// GET user dashboard data
app.get('/api/dashboard/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      about: user.about || '',
      skills: user.skills || [],
      projects: user.projects || [],
      experience: user.experience || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST user dashboard data
app.post('/api/dashboard/:email', async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { email: req.params.email },
      {
        about: req.body.about || '',
        skills: req.body.skills || [],
        projects: req.body.projects || [],
        experience: req.body.experience || []
      },
      { new: true, upsert: true }
    );
    res.json({ message: 'Profile updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Start Server ===
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
