const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { Username, Email, Password } = req.body;

  try {
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

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { Username, Password } = req.body;

    const existingUser = await User.findOne({ Username });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    const isPasswordValid = await bcrypt.compare(Password, existingUser.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        isAdmin: existingUser.IsAdmin,
        Username: existingUser.Username,
        Email: existingUser.Email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
