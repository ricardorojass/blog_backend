const express = require('express');
const {Story} = require('../models/Story');
const router = new express.Router();

// GET/stories
router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find({});
    res.send({stories});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/stories/:title', async (req, res) => {
  let title = req.params.title
  try {
    const story = await Story.findOne({title: title});

    if (!story) {
      return res.status(404).send();
    }
    res.send(story);
  } catch (e) {
    res.status(500).send();
  }
})

router.get('/:title/edit', async (req, res) => {
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
router.post('/stories', async (req, res) => {
  const story = new Story(req.body);

  try {
    await story.save()
    res.status(201).send(story);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE/stories/:id
router.delete('/stories/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);

    if (!story) {
      return res.status(404).send();
    }

    res.send(story);
  } catch (e) {
    res.status(500).send();
  }
});

// PATCH/stories/:title
router.patch('/stories/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'body'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

    if (!story) {
      return res.status(404).send();
    }

    res.send(story);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;