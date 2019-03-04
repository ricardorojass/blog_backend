const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const {mongose} = require('./config/mongoose');
const {Story} = require('./models/Story');

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// GET/stories
app.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find({})
    res.send({stories});
  } catch (e) {
    res.status(400).send(e)
  }
});

app.get('/stories/:title', async (req, res) => {
  let title = req.params.title
  try {
    const story = await Story.findOne({title: title});

    if (!story) {
      return res.status(404).send()
    }
    res.send(story);
  } catch (e) {
    res.status(500).send();
  }
})

app.get('/:title/edit', async (req, res) => {
  let title = req.params.title
  if (!title)
    return res.status(400).send('Missing URL parameter')

  try {
    const story = await Story.findOne({title: title});

    if (!story) {
      return res.status(404).send()
    }
    res.send(story);
  } catch (e) {
    res.status(500).send();
  }
})

// POST/stories
app.post('/stories', async (req, res) => {
  const story = new Story(req.body);

  try {
    await story.save()
    res.status(201).send(story);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};