const router = require('express').Router();
const authAdmin = require('../middlewares/authAdmin');
const auth = require('../middlewares/auth');

const Class = require('../models/Class');

// @route     GET api/classes
// @desc      Get all classes
// @acces     Public
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route     POST api/classes
// @desc      Create class
// @acces     Private
router.post('/', authAdmin, async (req, res) => {
  try {
    const { title, desc, trainer, duration, date, type } = req.body;

    // Create class
    const newClass = new Class({
      title,
      desc,
      trainer,
      duration,
      date,
      type,
    });

    // Save class to database
    await newClass.save();

    res.json(newClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     PUT api/classes/:id
// @desc      Edit an existing class
// @acces     Private
router.put('/:id', auth, async (req, res) => {
  try {
    const userType = req.user.type;
    const classToEdit = await Class.findById({ _id: req.params.id });

    switch (classToEdit.type) {
      case 'standard':
        switch (userType) {
          case 'standard':
            if (classToEdit.enrolled.some((id) => id === req.user.id)) {
              classToEdit.enrolled = classToEdit.enrolled.filter(
                (id) => id !== req.user.id
              );
            } else {
              classToEdit.enrolled.push(req.user.id);
            }
            await classToEdit.save();
            res.status(200).json({ msg: 'Success' });
            break;
          case 'premium':
            if (classToEdit.enrolled.some((id) => id === req.user.id)) {
              classToEdit.enrolled = classToEdit.enrolled.filter(
                (id) => id !== req.user.id
              );
            } else {
              classToEdit.enrolled.push(req.user.id);
            }
            await classToEdit.save();
            res.status(200).json({ msg: 'Success' });
            break;
          case 'admin':
            await classToEdit.update({ $set: req.body });
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
            if (classToEdit.enrolled.some((id) => id === req.user.id)) {
              classToEdit.enrolled = classToEdit.enrolled.filter(
                (id) => id !== req.user.id
              );
            } else {
              classToEdit.enrolled.push(req.user.id);
            }
            await classToEdit.save();
            res.status(200).json({ msg: 'Success' });
            break;
          case 'admin':
            await classToEdit.update({ $set: req.body });
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

// @route     DELETE api/classes/:id
// @desc      Delete class
// @acces     Private
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    await Class.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: 'Success' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
