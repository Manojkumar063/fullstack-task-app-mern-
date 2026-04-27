import React, { useState } from 'react';
import './Help.css';

function Help({ onBack }) {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I create a task?",
      answer: "Simply type your task in the input field and click 'Add' or press Enter. Your task will appear in the list below."
    },
    {
      question: "How do I mark a task as complete?",
      answer: "Click the checkbox next to any task to mark it as complete. The task will be crossed out. Click again to mark it incomplete."
    },
    {
      question: "Can I edit my tasks?",
      answer: "Currently, you can mark tasks as complete/incomplete or delete them. To change a task's text, delete it and create a new one."
    },
    {
      question: "How do I delete a task?",
      answer: "Click the 'Delete' button next to any task to remove it permanently from your list."
    },
    {
      question: "Where can I see my statistics?",
      answer: "Click the 'Stats' button in the navigation bar to view your task completion statistics and progress."
    },
    {
      question: "How do I update my profile?",
      answer: "Go to the Profile page, click 'Edit Profile', update your name, and click 'Save Changes'."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use industry-standard security including password hashing, JWT tokens, and HTTPS encryption."
    },
    {
      question: "How long do I stay logged in?",
      answer: "Your session lasts for 7 days. After that, you'll need to log in again for security purposes."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="help-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="help-content">
        <h1>❓ Help & FAQ</h1>
        
        <div className="tips-section">
          <h2>Quick Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">⚡</span>
              <p>Press Enter to quickly add tasks</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📊</span>
              <p>Check Stats to track your progress</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">✅</span>
              <p>Complete tasks to boost your completion rate</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🔒</span>
              <p>Your data is encrypted and secure</p>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
              </div>
              {openFaq === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        <div className="contact-section">
          <h3>Still need help?</h3>
          <p>Contact us at support@taskmanager.com</p>
        </div>
      </div>
    </div>
  );
}

export default Help;
