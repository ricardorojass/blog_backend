const express = require('express');
const {User} = require('../../models/User');
const router = new express.Router();

// Preload user objects on routes with ':users'
router.param('users', async (req, res, next, slug) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) { return res.status(404); }

    req.story = story;

    return next();
  } catch (e) {
    return next(e);
  }
});

// GET/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.send({users});
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
})

// POST/users
router.post('/', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save()
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

// PATCH/stories/:title
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;