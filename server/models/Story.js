const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {type: String, required: true, minLength: 2, trim: true},
  body: {type: String, required: true},
  owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
}, {timestamps: true});

const Story = mongoose.model('Story', storySchema);

module.exports = {Story};