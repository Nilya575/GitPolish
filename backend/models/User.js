const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  githubAccessToken: { type: String, default: null },
  githubId: { type: String, default: null }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;