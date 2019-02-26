const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const {mongose} = require('./config/mongoose');
const {User} = require('./models/user.js');
const {Story} = require('./models/story.js');

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// GET/stories
app.get('/stories', (req, res) => {
  Story.find().then((stories) => {
    res.send({stories});
  }, (e) => {
    res.status(400).send(e);
  });
});

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

// POST/stories
app.post('/stories', (req, res) => {
  const storyData = req.body

  let model = new Story({
    title: storyData.title,
    body: storyData.body,
  });

  model.save().then(doc => {
    if (!doc || doc.length === 0) {
      return res.status(500).send(doc)
    }

    res.status(200).json(doc)
  })
  .catch(err => {
    res.status(400).json(err)
  })
})

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};