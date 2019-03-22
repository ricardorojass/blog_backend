const cool = require('cool-ascii-faces')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')

const app = express()
const port = process.env.PORT || 3000

require('./config/mongoose')
require('./config/passport')

// Without middleware: new request -> run route handler

// With middleware: new request -> do something -> run route handler

// app.use((req, res, next) => {
//   res.status(503).send('We are in maintenance!');
// });

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(session({
  secret: 'conduit',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));
app.use(require('./routes'))


app.set('port', port)
const server = app.listen(app.get('port'), () => {
  console.log(`Express running ➡️  ➡️  ➡️PORT ${server.address().port}`)
})

module.exports = {app}