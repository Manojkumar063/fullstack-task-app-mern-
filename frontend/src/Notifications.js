import React, { useState, useEffect } from 'react';
import './Notifications.css';

function Notifications({ tasks, onBack }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const generateNotifications = () => {
      const notifs = [];
      const pendingTasks = tasks.filter(t => !t.completed);
      
      if (pendingTasks.length > 5) {
        notifs.push({
          id: 1,
          type: 'warning',
          message: `You have ${pendingTasks.length} pending tasks`,
          time: 'Just now'
        });
      }

      const completedToday = tasks.filter(t => {
        const taskDate = new Date(t.updatedAt);
        const today = new Date();
        return t.completed && taskDate.toDateString() === today.toDateString();
      });

      if (completedToday.length > 0) {
        notifs.push({
          id: 2,
          type: 'success',
          message: `Great job! You completed ${completedToday.length} task(s) today`,
          time: 'Today'
        });
      }

      if (tasks.length === 0) {
        notifs.push({
          id: 3,
          type: 'info',
          message: 'Start by adding your first task',
          time: 'Now'
        });
      }

      setNotifications(notifs);
    };

    generateNotifications();
  }, [tasks]);

  return (
    <div className="notifications-page">
      <button onClick={onBack} className="back-btn">← Back</button>
      <h1>Notifications</h1>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">No new notifications</div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`notification ${notif.type}`}>
              <div className="notif-icon">
                {notif.type === 'success' && '✓'}
                {notif.type === 'warning' && '⚠'}
                {notif.type === 'info' && 'ℹ'}
              </div>
              <div className="notif-content">
                <p>{notif.message}</p>
                <span className="notif-time">{notif.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
