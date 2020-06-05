const mongoose = require('mongoose');

const ClassSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  trainer: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  enrolled: {
    type: Array,
    default: [],
  },
  attended: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    default: 'regular',
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  giveups: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('class', ClassSchema);
