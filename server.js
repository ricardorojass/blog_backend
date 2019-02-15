const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const User = require('./models/User')
const Story = require('./models/Story')

const db = require('./db.json')

const posts = db


app.use(morgan('dev'));
app.use(cors())
app.use(bodyParser.json())

app.get('/articles', (req, res) => {
  Story.find({}).then((stories) => {
    res.send(stories)
  })
})

app.get('/article/:title', (req, res) => {
  let title = req.params.title
  if (!title)
    return res.status(400).send('Missing URL parameter')

  Story.findOne({
    title: title
  })
    .then(doc => {
      console.log('then', doc);

      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

app.get('/:title/edit', (req, res) => {
  let title = req.params.title
  if (!title)
    return res.status(400).send('Missing URL parameter')

  Story.findOne({
    title: title
  })
    .then(doc => {
      console.log('edit', doc);

      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

app.post('/article/new', (req, res) => {
  const storyData = req.body
  if (!storyData)
    return res.status(400).send('Request body is mising')

  let model = new Story(req.body)
  model.save()
    .then(doc => {
      if (!doc || doc.length === 0) {
        return res.status(500).send(doc)
      }

      res.status(201).json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

mongoose.connect('mongodb://test:ricardo123@ds139138.mlab.com:39138/blog-ricardo', (err) => {
  if(!err)
    console.log('connected to mongo')
})

app.listen(3000)