const express = require('express');
const {Story} = require('../../models/Story');
const auth = require('../../middleware/auth');
const router = new express.Router();

// Preload article objects on routes with ':article'
router.param('stories', async (req, res, next, slug) => {
  try {
    const story = await Story.findOne({ title: title});

    if (!story) { return res.status(404); }

    req.story = story;

    return next();
  } catch (e) {
    return next(e);
  }
});

// POST/stories
router.post('/', auth.required, async (req, res) => {
  const story = new Story({
    ...req.body,
    owner: req.user._id
  })

  try {
    await story.save()
    res.status(201).send(story);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET/stories
router.get('/', async (req, res) => {
  try {
    // await req.user.populate('stories').execPopulate()
    const stories = await Story.find({})

    if (!stories) {
      return res.status(404).send()
    }

    res.send({stories})
  } catch (e) {
    res.status(400).send(e)
  }
});

router.get('/:id', async (req, res) => {
  let _id = req.params.id
  try {
    const story = await Story.findById(_id)

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

// PATCH/stories/:id
router.patch('/:id', auth.required, async (req, res) => {
  console.log(req.body);

  const updates = Object.keys(req.body)
  const allowedUpdates = ['title', 'body']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const story = await Story.findOne({ _id: req.params.id, owner: req.user._id })

    if (!story) {
      return res.status(404).send()
    }

    updates.forEach((update) => story[update] = req.body[update])
    await story.save()
    res.send(story)
  } catch (e) {
    res.status(400).send(e)
  }
});

// DELETE/stories/:id
router.delete('/:id', auth.required, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({ _id: req.params.id, owner: req.user.id })

    if (!story) {
      return res.status(404).send();
    }

    res.send(story);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;