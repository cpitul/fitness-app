const router = require('express').Router();
const authAdmin = require('../middlewares/authAdmin');
const auth = require('../middlewares/auth');

const Class = require('../models/Class');
const User = require('../models/User');

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
      time,
      type,
    });

    // Save class to database
    await newClass.save();

    res.status(201).json(newClass);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     PUT api/classes/:id
// @desc      Edit an existing class and let users enroll
// @acces     Private
router.put('/:id', auth, async (req, res) => {
  try {
    const userType = req.user.type;
    const classToEdit = await Class.findById({ _id: req.params.id });

    switch (classToEdit.type) {
      case 'regular':
        switch (userType) {
          case 'paid':
            try {
              const user = User.findById({ _id: req.user.id });

              // if user is already enrolled, remove him from the class
              if (classToEdit.enrolled.some((id) => id === req.user.id)) {
                classToEdit.enrolled = classToEdit.enrolled.filter(
                  (id) => id !== req.user.id
                );

                // remove the class from the user's enrolled list
                user.enrolled = user.enrolled.filter(
                  (id) => id !== req.params.id
                );

                // increment the number of give ups to the class
                classToEdit.giveups++;
              } else {
                // add user to class
                classToEdit.enrolled.unshift(req.user.id);
                // add class to user's enrolled list
                user.enrolled.unshift(req.params.id);
              }

              await classToEdit.save();
              await user.save();

              res.status(200).json({ msg: 'Success' });
            } catch (err) {
              console.error(err.message);
              res.status(500).send('Server Error');
            }
            break;
          case 'desk':
            try {
              const user = await User.findById({ _id: req.body.id });

              // if user is already enrolled, remove him from the class
              if (classToEdit.enrolled.some((id) => id === req.body.id)) {
                classToEdit.enrolled = classToEdit.enrolled.filter(
                  (id) => id !== req.body.id
                );

                // remove the class from the user's enrolled list
                user.enrolled = user.enrolled.filter(
                  (id) => id !== req.params.id
                );

                // increment the number of give ups to that class
                classToEdit.giveups++;
              } else {
                // add user to class
                classToEdit.enrolled.unshift(req.user.id);
                // add class to user's enrolled list
                user.enrolled.unshift(req.params.id);
              }

              await classToEdit.save();
              await user.save();

              res.status(200).json({ msg: 'Success' });
            } catch (err) {
              console.error(err.message);
              res.status(500).send('Server Error');
            }
            break;
          case 'admin':
            try {
              // save existing enrolled users list
              const enrolled = classToEdit.enrolled;

              // make the update
              await classToEdit.update({ $set: req.body });

              // if there was a request to add a user to the class,
              // add user to enrolled users list
              if (req.body.enrolled) {
                enrolled.unshift(req.body.enrolled);

                // update the enrolled list
                await classToEdit.update({ $set: { enrolled } });
              }

              res.status(200).json(classToEdit);
            } catch (err) {
              console.error(err.message);
              res.status(500).send('Server Error');
            }
            break;
          default:
            res.status(403).send('Acces denied');
            break;
        }
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
