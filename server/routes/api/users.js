const express = require('express');
const {User} = require('../../models/User');
const auth = require('../../middleware/auth');
const router = new express.Router();

// Preload user objects on routes with ':users'
router.param('users', async (req, res, next, slug) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) { return res.status(404); }

    req.user = user;

    return next();
  } catch (e) {
    return next(e);
  }
});

// POST/users
router.post('/', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save()
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// POST/users/login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// GET/users
router.get('/', auth, async (req, res) => {
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

// PATCH/users/:id
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {

    const user = await User.findById(req.params.id);

    updates.forEach((update) => user[update] = req.body[update]);

    await user.save();

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;