const mongoose = require('mongoose')
require('dotenv').config({ path: 'variables.env' })

// Connect to our database and handle an bad connections
mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useNewUrlParser: true
})
mongoose.Promise = global.Promise // tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🐽 🚫 🐽 🚫 🐽 🚫 🐽 🚫 ➡️ ${err.message}`)
})

module.exports = {mongoose}