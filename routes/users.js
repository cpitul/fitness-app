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
        date_expires,
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

// @route     POST api/users/:id
// @desc      Check if membership is valid
// @acces     Private
router.post('/:id', authAdmin, async (req, res) => {
  try {
    const date = new Date();
    const user = await User.find({ _id: req.params.id }).select('date_expires');
    const expires = new Date(user[0].date_expires);

    const dif = expires.getUTCMonth() - date.getUTCMonth();

    if (dif < 0) {
      return res.status(401).send('Expired');
    } else if (dif === 0) {
      expires.getUTCDate() - date.getUTCDate() >= 0
        ? res.status(200).send('Valid')
        : res.status(401).send('Expired');
    } else {
      return res.status(200).send('Valid');
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send('No user found');
  }
});

module.exports = router;
