const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Story = require('./Story')
const secret = require('../config').secret

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, trim: true},
  email: {type: String, unique: true, required: true, trim: true},
  image: String,
  hash: String,
  salt: String,
}, {timestamps: true})

userSchema.virtual('stories', {
  ref: 'Story',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.validPassword = function(password) {
  const user = this
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return user.hash === hash
}

userSchema.methods.setPassword = function(password){
  const user = this
  user.salt = crypto.randomBytes(16).toString('hex')
  user.hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
}

// Methods can access from instance
userSchema.methods.generateJWT = function() {
  const user = this
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: user._id,
    username: user.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret)
}

userSchema.methods.toAuthJSON = function(){
  const user = this
  return {
    username: user.username,
    email: user.email,
    token: user.generateJWT(),
    image: user.image
  };
}

userSchema.methods.toProfileJSONFor = function(user){
  return {
    username: this.username
  };
};

// Access from model
// userSchema.statics.findByCredentials = async (email, password) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error('Unable to login');
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     throw new Error('Unable to login');
//   }

//   return user;
// }

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user stories when user is removed
userSchema.pre('remove', async function(next) {
  const user = this
  await Story.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema);

module.exports = {User};