const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const User = require('./models/User')

const db = require('./db.json')

const posts = db


app.use(morgan('dev'));
app.use(cors())
app.use(bodyParser.json())

app.get('/articles', (req, res) => {
  res.status(200).json(db.articles)
})

app.get('/articles/:id', (req, res) => {
  res.status(200).json(db.articles[0])
  // res.send(db.articles[0])
})

app.post('/register', (req, res) => {
  const userData = req.body
  let user = new User(userData)

  user.save((err, result) => {
    if (err)
      console.log('saving user error')

    res.sendStatus(200)
  })
})

mongoose.connect('mongodb://test:ricardo123@ds139138.mlab.com:39138/blog-ricardo', (err) => {
  if(!err)
    console.log('connected to mongo')
})

app.listen(3000)