const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const {mongose} = require('./config/mongoose');
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

app.get('/stories/:title', (req, res) => {
  let title = req.params.title

  Story.findOne({title: title}).then(story => {
    if(!story)
      res.status(404).send({});

    res.send({story})
    })
    .catch(err => {
      res.status(400).send({});
    });
})

app.get('/:title/edit', (req, res) => {
  let title = req.params.title
  if (!title)
    return res.status(400).send('Missing URL parameter')

  Story.findOne({
    title: title
  })
    .then(story => {
      if (!story)
        return res.status(404).send({});

      console.log('edit', story);
      res.status(200).send(story);
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

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};