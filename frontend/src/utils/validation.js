export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, error: 'Email is required' };
  if (!re.test(email)) return { valid: false, error: 'Invalid email format' };
  if (email.length > 100) return { valid: false, error: 'Email too long' };
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (password.length > 128) return { valid: false, error: 'Password too long' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Must contain lowercase letter' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Must contain uppercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Must contain number' };
  if (!/[!@#$%^&*]/.test(password)) return { valid: false, error: 'Must contain special character (!@#$%^&*)' };
  return { valid: true };
};

export const validateName = (name) => {
  if (!name) return { valid: false, error: 'Name is required' };
  const trimmed = name.trim();
  if (trimmed.length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  if (trimmed.length > 50) return { valid: false, error: 'Name too long' };
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return { valid: false, error: 'Name contains invalid characters' };
  return { valid: true };
};

export const validateTaskTitle = (title) => {
  if (!title) return { valid: false, error: 'Title is required' };
  const trimmed = title.trim();
  if (trimmed.length === 0) return { valid: false, error: 'Title cannot be empty' };
  if (trimmed.length > 200) return { valid: false, error: 'Title too long (max 200)' };
  return { valid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim();
};

export const validateFile = (file) => {
  const allowedTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg', 'image/jpg'];
  if (!file) return { valid: false, error: 'File is required' };
  if (!allowedTypes.includes(file.type)) return { valid: false, error: 'Invalid file type' };
  if (file.size > 10 * 1024 * 1024) return { valid: false, error: 'File too large (max 10MB)' };
  return { valid: true };
};

export const validateTaskUpdate = (updates) => {
  const allowedFields = ['title', 'completed'];
  for (let key in updates) {
    if (!allowedFields.includes(key)) {
      return { valid: false, error: `Invalid field: ${key}` };
    }
    if (key === 'title') {
      const titleValidation = validateTaskTitle(updates.title);
      if (!titleValidation.valid) return { valid: false, error: titleValidation.error };
    }
    if (key === 'completed' && typeof updates.completed !== 'boolean') {
      return { valid: false, error: 'Completed must be a boolean' };
    }
  }
  return { valid: true };
};      