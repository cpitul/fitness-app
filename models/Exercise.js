const mongoose = require('mongoose');

const ExerciseSchema = mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  type: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('exercise', ExerciseSchema);
