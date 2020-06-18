const router = require('express').Router();
const authAdmin = require('../middlewares/authAdmin');
const auth = require('../middlewares/auth');

const Class = require('../models/Class');
const User = require('../models/User');

// @route     GET api/classes
// @desc      Get all classes
// @acces     Private
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route     GET api/classes/:id
// @desc      Get specific class
// @acces     Private
router.get('/:id', auth, async (req, res) => {
  try {
    const classResult = await Class.find({ _id: req.params.id });
    res.json(classResult);
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
    const { title, desc, trainer, duration, date, time, type, max } = req.body;

    // Create class
    const newClass = new Class({
      title,
      desc,
      trainer,
      duration,
      date,
      time,
      type,
      max,
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

              // check if user is already enrolled
              if (classToEdit.enrolled.some((id) => id === req.user.id)) {
                const date = new Date();
                const classTime = new Date(
                  `${classToEdit.date} ${classToEdit.time}`
                );
                // check if the request is made at hours - 1 from the start of the class
                if (
                  classTime.getHours - 1 === date.getHours() &&
                  classTime.getDate() === date.getDate()
                ) {
                  // check minutes
                  if (classTime.getMinutes() - date.getMinutes() === 0) {
                    res.status(403).json({ msg: `1 hour left until start` });
                  } else {
                    // remove user from class
                    classToEdit.enrolled = classToEdit.enrolled.filter(
                      (id) => id !== req.body.id
                    );

                    // remove the class from the user's enrolled list
                    user.enrolled = user.enrolled.filter(
                      (id) => id !== req.params.id
                    );

                    // increment the number of give ups to that class
                    classToEdit.giveups++;
                  }
                }
                // test if class is full and reject if it is
              } else if (classToEdit.enrolled.length === classToEdit.max) {
                res.status(403).json({ msg: 'Class is full' });
                break;
              } else {
                const date = new Date();
                const classDate = new Date(
                  `${classToEdit.date} ${classToEdit.time}`
                );
                // test if there is a maximum of two days difference
                // between date of the class and date of the request
                if (classDate.getDate() - date.getDate() <= 2) {
                  // add user to class
                  classToEdit.enrolled.unshift(req.user.id);
                  // add class to user's enrolled list
                  user.enrolled.unshift(req.params.id);
                } else {
                  res.status(403).json({
                    msg: 'You can only enroll to class two days in advanced',
                  });
                }
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
              const date = new Date();

              if (req.body.attended) {
                if (
                  !classToEdit.attended.some((id) => id === req.body.attended)
                ) {
                  const check_in = `${
                    user.name
                  } checked in on ${date.getDate()}.${
                    date.getMonth() + 1
                  }.${date.getFullYear()} for ${classToEdit.title}`;

                  user.check_in.unshift(check_in);

                  user.enrolled = user.enrolled.filter(
                    (id) => id === classToEdit._id
                  );

                  classToEdit.attended.unshift(req.body.attended);

                  await classToEdit.save();
                  await user.save();
                }
              } else {
                // check if user is already enrolled
                if (classToEdit.enrolled.some((id) => id === req.body.id)) {
                  const classTime = new Date(
                    `${classToEdit.date} ${classToEdit.time}`
                  );
                  // check if the request is made at hours - 1 from the start of the class
                  if (
                    classTime.getHours - 1 === date.getHours() &&
                    classTime.getDate() === date.getDate()
                  ) {
                    // check minutes
                    if (classTime.getMinutes() - date.getMinutes() === 0) {
                      res.status(403).json({ msg: `1 hour left until start` });
                    } else {
                      // remove user from class
                      classToEdit.enrolled = classToEdit.enrolled.filter(
                        (id) => id !== req.body.id
                      );

                      // remove the class from the user's enrolled list
                      user.enrolled = user.enrolled.filter(
                        (id) => id !== req.params.id
                      );

                      // increment the number of give ups to that class
                      classToEdit.giveups++;
                    }
                  }
                  // test if the class is full and reject if it is
                } else if (classToEdit.enrolled.length === classToEdit.max) {
                  res.status(403).json({ msg: 'Class is full' });
                  break;
                } else {
                  const date = new Date();
                  const classDate = new Date(
                    `${classToEdit.date} ${classToEdit.time}`
                  );
                  // test if there is a maximum of two days difference
                  // between date of the class and date of the request
                  if (classDate.getDate() - date.getDate() <= 2) {
                    // add user to class
                    classToEdit.enrolled.unshift(req.user.id);
                    // add class to user's enrolled list
                    user.enrolled.unshift(req.params.id);
                  } else {
                    res.status(403).json({
                      msg: 'You can only enroll to class two days in advanced',
                    });
                  }
                }
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
              // if there was a request to add/remove a user to the class,
              if (req.body.enrolled) {
                const user = await User.findById({ _id: req.body.enrolled });

                // check if user is already enrolled
                if (
                  classToEdit.enrolled.some((id) => id === req.body.enrolled)
                ) {
                  // remove user from class
                  classToEdit.enrolled = classToEdit.enrolled.filter(
                    (id) => id !== req.body.enrolled
                  );

                  // remove the class from the user's enrolled list
                  user.enrolled = user.enrolled.filter(
                    (id) => id !== req.params.id
                  );

                  // increment the number of give ups to that class
                  classToEdit.giveups++;

                  await classToEdit.save();
                  await user.save();
                } else {
                  // test if the class is full
                  if (classToEdit.enrolled.length === classToEdit.max) {
                    // Reject if class is full
                    res.status(403).json({ msg: 'Class is full' });
                  } else {
                    // Add user to class
                    classToEdit.enrolled.unshift(req.body.enrolled);

                    // add class to user's enrolled list
                    user.enrolled.unshift(req.params.id);

                    await classToEdit.save();
                    await user.save();
                  }
                }
              } else {
                if (req.body.attended) {
                  if (
                    !classToEdit.attended.some((id) => id === req.body.attended)
                  ) {
                    const check_in = `${
                      user.name
                    } checked in on ${date.getDate()}.${
                      date.getMonth() + 1
                    }.${date.getFullYear()} for ${classToEdit.title}`;

                    user.check_in.unshift(check_in);
                    user.enrolled = user.enrolled.filter(
                      (id) => id !== classToEdit._id
                    );
                    classToEdit.attended.unshift(req.body.attended);

                    await user.save();
                    await classToEdit.save();
                  }
                } else {
                  // make the update
                  try {
                    await classToEdit.updateOne({ $set: req.body });
                    res.status(200).json({ msg: 'Success' });
                  } catch (err) {
                    console.error(err.message);
                    res.status(500).send('Server Error');
                  }
                }
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
