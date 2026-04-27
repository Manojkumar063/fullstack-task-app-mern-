import React, { useState } from 'react';
import './Calendar.css';

function Calendar({ tasks, onBack }) {
  const [currentDate] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.getDate() === day && 
             taskDate.getMonth() === currentDate.getMonth() &&
             taskDate.getFullYear() === currentDate.getFullYear();
    });
  };

  return (
    <div className="calendar-page">
      <button onClick={onBack} className="back-btn">← Back</button>
      <h1>Task Calendar</h1>
      <h2>{monthName}</h2>
      
      <div className="calendar">
        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="days">
          {[...Array(firstDay)].map((_, i) => (
            <div key={`empty-${i}`} className="day empty"></div>
          ))}
          
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dayTasks = getTasksForDay(day);
            const isToday = day === new Date().getDate() && 
                           currentDate.getMonth() === new Date().getMonth();
            
            return (
              <div key={day} className={`day ${isToday ? 'today' : ''}`}>
                <div className="day-number">{day}</div>
                {dayTasks.length > 0 && (
                  <div className="task-indicator">{dayTasks.length}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
