const mongoose = require('mongoose');

mongoose.connect('mongodb://test:ricardo123@ds139138.mlab.com:39138/blog-ricardo', (err) => {
  if(!err)
    console.log('connected to mongo');
});

module.exports = {mongoose};