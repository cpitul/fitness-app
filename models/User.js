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
    required: true,
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
  // services is an array of objects that has
  // type (PT or VR) and tokens available (ex: 10)
  services: {
    type: Array,
    default: [],
  },
  panalties: {
    type: Number,
    default: 0,
  },
  enrolled: {
    type: Array,
    default: [],
  },
  check_in: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('user', UserSchema);
