const mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: null,
  },
  updatedAt: {
    type: Number,
    default: null,
  },
});

module.exports = {User};