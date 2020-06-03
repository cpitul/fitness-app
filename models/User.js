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
    default: '123456',
  },
  phone: {
    type: String,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  membership_created: {
    type: String,
  },
  membership_expires: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    default: 'free',
  },
});

module.exports = mongoose.model('user', UserSchema);
