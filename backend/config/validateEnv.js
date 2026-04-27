const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'CLIENT_URL'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.JWT_SECRET === 'your_jwt_secret_key_change_in_production') {
    console.warn('WARNING: Using default JWT_SECRET. Change this in production!');
  }
};

module.exports = validateEnv;
