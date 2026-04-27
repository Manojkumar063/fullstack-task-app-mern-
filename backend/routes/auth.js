const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');
const { validateEmail, validatePassword, validateName } = require('../utils/validation');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ message: emailValidation.error });
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.error });
    }
    
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.error });
    }
    
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ 
      email: email.toLowerCase(), 
      password: hashedPassword, 
      name: nameValidation.value 
    });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger.info(`User registered: ${user.email}`);
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      await bcrypt.hash(password, 10); // Prevent timing attacks
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Failed login attempt: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger.info(`User logged in: ${user.email}`);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.error });
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: nameValidation.value },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    logger.info(`Profile updated: ${user.email}`);
    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/logout', auth, (req, res) => {
  // For JWT, logout is handled client-side by deleting the token
  logger.info(`User logged out: ${req.userId}`);
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;
