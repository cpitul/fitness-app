require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const authDesk = require('../middlewares/authDesk');

const User = require('../models/User');

// @route     GET api/users/:id
// @desc     Get user by id
// @access     Private
router.get('/:id', authDesk, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(404).send('No user found');
  }
});

// @route     POST api/users
// @desc      Get all users or get search user
// @acces     Private
router.post('/', authDesk, async (req, res) => {
  try {
    if (req.body.name) {
      const user = await User.find({
        $text: {
          $search: req.body.name,
          $caseSensitive: false,
          $diacriticSensitive: false,
        },
      });

      if (!user) {
        res.status(404).json({ msg: 'No user found' });
      }

      res.status(200).json(user);
    } else {
      const users = await User.find({ type: { $nin: ['admin', 'desk'] } });

      if (!users) {
        res.status(404).json({ msg: 'No users found' });
      }

      res.status(200).json(users);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/users
// @desc      Register user
// @acces     Private
router.post(
  '/',
  [
    check('name', 'Please enter your name').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    authDesk,
  ],
  async (req, res) => {
    // Check for errors after the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      phone,
      type,
      date_created,
      membership_created,
      membership_expires,
    } = req.body;

    try {
      // Test if email already exists in DB
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ msg: 'User already exists' });

      // Create the new user
      const user = new User({
        name,
        email,
        password,
        phone,
        type,
        date_created,
        membership_created,
        membership_expires,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Create payload for JWT to return
      const payload = {
        user: {
          id: user.id,
          type: user.type,
          membership_expires: user.membership_expires,
          penalties: user.penalties,
          services: user.services,
          enrolled: user.enrolled,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     POST api/users/memberships
// @desc      Update expired memberships
// @acces     Private
router.post('/memberships', authDesk, async (req, res) => {
  try {
    const users = await User.find().select('membership_expires').select('type');

    const memberships = users.filter((user) => user.membership_expires);

    if (!memberships) return res.status(404).send('No memberships active');

    memberships.map(async (membership) => {
      const date = new Date();
      const expires = new Date(membership.membership_expires);
      const dif = expires.getMonth() - date.getMonth();

      if (dif < 0) {
        // Membership is expired
        await membership.updateOne({
          $set: {
            type: 'free',
            membership_created: '',
            membership_expires: '',
          },
        });
      } else if (dif === 0) {
        // Test if there are days left of membership
        if (expires.getDate() - date.getDate() < 0) {
          // No days left in the membership
          await membership.updateOne({
            $set: {
              type: 'free',
              membership_created: '',
              membership_expires: '',
            },
          });
        }
      }
    });
    res.status(200).send('Success');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     PUT api/users/:id
// @desc      Update user
// @acces     Private
router.put('/:id', authDesk, async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({ msg: 'Success' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
