const express = require('express')
const {User} = require('../../models/User')
const auth = require('../../middleware/auth')
const router = new express.Router()
const passport = require('passport')

// Preload user objects on routes with ':users'
router.param('/user', auth.required, async (req, res, next) => {
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
  const user = new User(req.body)
  console.log(user);


  try {
    user.setPassword(req.body.password)

    await user.save()

    res.send({ user: user.toAuthJSON() })
  } catch (e) {
    res.status(400).send(e)
  }
})

// POST/users/login
router.post('/login', async (req, res, next) => {
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  try {
    passport.authenticate('local', {session: false}, function(err, user, info) {
      if(err){ return next(err) }

      if(!user){ return res.status(422).send(info) }

      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()})
    })(req, res, next)
  } catch (e) {
    res.status(400).send();
  }
});

// POST/users/logout for one session
router.post('/logout', auth.required, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
});

// POST/users/logoutAll for all sessions
router.post('/logoutAll', auth.required, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// GET/users
router.get('/me', auth.required, async (req, res) => {
    res.send(req.user);
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

// PATCH/users/:id
router.patch('/me', auth.required, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['username', 'email', 'password']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])

    await req.user.save()

    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
});

// DELETE/users/me
router.delete('/me', auth.required, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router