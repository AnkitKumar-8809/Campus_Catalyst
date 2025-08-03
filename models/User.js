const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  about: { type: String, default: '' },
  skills: [String],
  projects: [{
    name: String,
    description: String
  }],
  experience: [{
    role: String,
    company: String,
    duration: String
  }]
});

module.exports = mongoose.model('User', userSchema);
