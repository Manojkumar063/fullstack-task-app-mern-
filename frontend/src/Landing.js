import React from 'react';
import './Landing.css';

function Landing({ onGetStarted, onAbout }) {
  return (
    <div className="landing">
      <div className="hero">
        <h1>Task Manager</h1>
        <p>Simple, fast, and efficient task management</p>
        <div className="button-group">
          <button className="cta-button" onClick={onGetStarted}>
            Get Started
          </button>
          <button className="secondary-button" onClick={onAbout}>
            Learn More
          </button>
        </div>
      </div>
      <div className="features">
        <div className="feature">
          <h3>📝 Easy to Use</h3>
          <p>Add and manage tasks effortlessly</p>
        </div>
        <div className="feature">
          <h3>✅ Track Progress</h3>
          <p>Mark tasks as complete</p>
        </div>
        <div className="feature">
          <h3>🔒 Secure</h3>
          <p>Production-grade security</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
