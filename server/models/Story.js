const mongoose = require('mongoose');

const Story = mongoose.model('Story', {
  title: {
    type: String,
    required: true,
    minLength: 2,
    trim: true,
  },
  body: {
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

module.exports = {Story};