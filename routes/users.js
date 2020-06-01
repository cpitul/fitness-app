require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const authAdmin = require('../middlewares/authAdmin');

const User = require('../models/User');

// @route     POST api/users
// @desc      Register user
// @acces     Public
router.post(
  '/',
  [
    check('name', 'Please enter your name').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
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
      date_expires,
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
router.post('/memberships', authAdmin, async (req, res) => {
  try {
    const users = await User.find().select('membership_expires').select('type');

    const memberships = users.filter((user) => user.membership_expires);

    if (!memberships) return res.status(404).send('No memberships active');

    memberships.map(async (membership) => {
      const date = new Date();
      const expires = new Date(membership.membership_expires);
      const dif = expires.getUTCMonth() - (date.getUTCMonth() - 1);

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
        if (expires.getUTCDate() - date.getUTCDate() < 0) {
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

module.exports = router;
