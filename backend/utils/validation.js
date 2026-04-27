const validator = require('validator');

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return { valid: false, error: 'Email is required' };
  if (!validator.isEmail(email)) return { valid: false, error: 'Invalid email format' };
  if (email.length > 100) return { valid: false, error: 'Email too long' };
  return { valid: true };
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return { valid: false, error: 'Password is required' };
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (password.length > 128) return { valid: false, error: 'Password too long' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Password must contain lowercase letter' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain uppercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Password must contain number' };
  if (!/[!@#$%^&*]/.test(password)) return { valid: false, error: 'Password must contain special character (!@#$%^&*)' };
  return { valid: true };
};

const validateName = (name) => {
  if (!name || typeof name !== 'string') return { valid: false, error: 'Name is required' };
  const trimmed = name.trim();
  if (trimmed.length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  if (trimmed.length > 50) return { valid: false, error: 'Name too long' };
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return { valid: false, error: 'Name contains invalid characters' };
  return { valid: true, value: trimmed };
};

const validateTaskTitle = (title) => {
  if (!title || typeof title !== 'string') return { valid: false, error: 'Title is required' };
  const trimmed = title.trim();
  if (trimmed.length === 0) return { valid: false, error: 'Title cannot be empty' };
  if (trimmed.length > 200) return { valid: false, error: 'Title too long (max 200 characters)' };
  if (/<script|javascript:|onerror=/i.test(trimmed)) return { valid: false, error: 'Invalid content detected' };
  return { valid: true, value: trimmed };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateTaskTitle,
  sanitizeInput
};
