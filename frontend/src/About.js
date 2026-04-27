import React from 'react';
import './About.css';

function About({ onBack }) {
  return (
    <div className="about">
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="about-content">
        <h1>About Task Manager</h1>
        <p className="subtitle">Built with the MERN Stack</p>
        
        <div className="tech-stack">
          <div className="tech">
            <h2>🍃 MongoDB</h2>
            <p>NoSQL database for flexible data storage</p>
          </div>
          <div className="tech">
            <h2>⚡ Express</h2>
            <p>Fast, minimalist web framework for Node.js</p>
          </div>
          <div className="tech">
            <h2>⚛️ React</h2>
            <p>Modern UI library for building interfaces</p>
          </div>
          <div className="tech">
            <h2>🟢 Node.js</h2>
            <p>JavaScript runtime for server-side code</p>
          </div>
        </div>

        <div className="info-section">
          <h3>Features</h3>
          <ul>
            <li>Create, update, and delete tasks</li>
            <li>Mark tasks as complete/incomplete</li>
            <li>Real-time updates</li>
            <li>Production-grade security</li>
            <li>Rate limiting & validation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;
