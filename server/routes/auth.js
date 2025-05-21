const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');


// Register Route

router.post('/register', async (req, res) => {
    const { Username, Email, Password } = req.body;

    const existingUsername = await User.findOne({ Username });
    const existingEmail = await User.findOne({ Email });

    if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
        Username,
        Email,
        Password: hashedPassword
    });

    try {
        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
  try {
    const { Username, Password } = req.body;

    const existingUsername = await User.findOne({ Username });
    if (!existingUsername) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    const isPasswordValid = await bcrypt.compare(Password, existingUsername.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: existingUsername._id
      ,isAdmin : existingUsername.IsAdmin
     }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Protected Profile Route
/*router.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
});*/

module.exports = router;
