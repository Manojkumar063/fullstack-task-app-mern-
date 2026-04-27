const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const logger = require('../utils/logger');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { sub: googleId, email, name, picture } = ticket.getPayload();
    
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.googleId = googleId;
        user.avatar = picture;
        await user.save();
      } else {
        user = new User({
          email: email.toLowerCase(),
          name,
          googleId,
          avatar: picture,
          password: Math.random().toString(36)
        });
        await user.save();
      }
    }
    
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    logger.info(`OAuth login: ${user.email}`);
    res.json({ token: jwtToken, user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (error) {
    logger.error('OAuth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
