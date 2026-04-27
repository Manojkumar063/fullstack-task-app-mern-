import React, { useState } from 'react';
import './Auth.css';
import { validateEmail, validatePassword } from './utils/validation';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    const errors = {};
    if (!emailValidation.valid) errors.email = emailValidation.error;
    if (!passwordValidation.valid) errors.password = passwordValidation.error;

    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="switch-auth">
          Don't have an account? <span onClick={onSwitchToRegister}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
