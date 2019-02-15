const mongoose = require('mongoose')

module.exports = mongoose.model('Story', {
  title: String,
  body: String,
  createdAt: Date,
  updatedAt: Date
})