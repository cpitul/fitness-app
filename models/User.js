const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
    default: 'free',
  },
});

module.exports = mongoose.model('user', UserSchema);
