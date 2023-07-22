const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'teamLeader', 'admin'],
    default: 'user',
  },
  permissions: {
    // Define permissions for each user role
    type: [String],
    default: [],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
