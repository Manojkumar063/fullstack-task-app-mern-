const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true, 
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Invalid email format'
    },
    maxlength: [100, 'Email too long']
  },
  password: { 
    type: String, 
    required: function() { return !this.googleId; },
    minlength: [8, 'Password must be at least 8 characters']
  },
  googleId: {
    type: String,
    sparse: true
  },
  avatar: {
    type: String
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name too long']
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, { 
  timestamps: true,
  toJSON: { 
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  }
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
