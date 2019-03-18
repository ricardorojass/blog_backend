const mongoose = require('mongoose');
const user = 'admin'
const pwd = 'Ricardo123..'

mongoose.connect(
  process.env.MONGODB_URI ||
  `mongodb://${user}:${pwd}@ds147592.mlab.com:47592/blog-ricardo`, (err) => {
  if(!err)
    console.log('connected to mongo');
});

module.exports = {mongoose};