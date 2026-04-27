import React, { useState } from 'react';
import './Auth.css';
import { validateEmail, validatePassword, validateName } from './utils/validation';

function Register({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    const errors = {};
    if (!nameValidation.valid) errors.name = nameValidation.error;
    if (!emailValidation.valid) errors.email = emailValidation.error;
    if (!passwordValidation.valid) errors.password = passwordValidation.error;
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setLoading(true);
    try {
      await onRegister(name, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
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
            placeholder="Password (8+ chars, A-Z, a-z, 0-9, !@#$%^&*)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="switch-auth">
          Already have an account? <span onClick={onSwitchToLogin}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
