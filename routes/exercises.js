const router = require('express').Router();
const authAdmin = require('../middlewares/authAdmin');
const auth = require('../middlewares/auth');

const Exercise = require('../models/Exercise');

// @route     GET api/exercises
// @desc      Get all exercises
// @acces     Public
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route     POST api/exercises
// @desc      Create exercise
// @acces     Private
router.post('/', authAdmin, async (req, res) => {
  try {
    const { title, desc, trainer, duration, date, type } = req.body;

    // Create exercise
    const exercise = new Exercise({
      title,
      desc,
      trainer,
      duration,
      date,
      type,
    });

    // Save exercise to database
    await exercise.save();

    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     PUT api/exercises
// @desc      Edit an existing exercise
// @acces     Private
router.put('/:id', auth, async (req, res) => {
  try {
    const userType = req.user.type;
    const exercise = await Exercise.findById({ _id: req.params.id });

    switch (exercise.type) {
      case 'standard':
        switch (userType) {
          case 'standard':
            if (exercise.enrolled.some((id) => id === req.user.id)) {
              exercise.enrolled = exercise.enrolled.filter(
                (id) => id !== req.user.id
              );
            } else {
              exercise.enrolled.push(req.user.id);
            }
            await exercise.save();
            res.status(200).json({ msg: 'Success' });
            break;
          case 'premium':
            if (exercise.enrolled.some((id) => id === req.user.id)) {
              exercise.enrolled = exercise.enrolled.filter(
                (id) => id !== req.user.id
              );
            } else {
              exercise.enrolled.push(req.user.id);
            }
            await exercise.save();
            res.status(200).json({ msg: 'Success' });
            break;
          case 'admin':
            await exercise.update({ $set: req.body });
            res.status(200).json({ msg: 'Success' });
            break;
          default:
            res.status(403).send('Acces denied standard');
            break;
        }
        break;
      case 'premium':
        switch (userType) {
          case 'premium':
            if (exercise.enrolled.some((id) => id === req.user.id)) {
              exercise.enrolled = exercise.enrolled.filter(
                (id) => id !== req.user.id
              );
            } else {
              exercise.enrolled.push(req.user.id);
            }
            await exercise.save();
            res.status(200).json({ msg: 'Success' });
            break;
          case 'admin':
            await exercise.update({ $set: req.body });
            res.status(200).json({ msg: 'Success' });
            break;
          default:
            res.status(403).send('Acces denied premium');
            break;
        }
        break;

      default:
        res.status(500).send('Server Error');
        break;
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/exercises/:id
// @desc      Delete exercise
// @acces     Private
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    await Exercise.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: 'Success' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
