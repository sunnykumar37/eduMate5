import React from 'react';
import './Achievements.css';

const AchievementsList = ({ achievements }) => {
  return (
    <div className="analytics-card">
      <h2>Recent Achievements</h2>
      
      {achievements.length > 0 ? (
        <div className="achievements-list">
          {achievements.map(achievement => (
            <div key={achievement.id} className="achievement-item">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <span className="achievement-date">{achievement.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No achievements yet!</p>
          <p>Keep learning to earn badges.</p>
        </div>
      )}
      
      <button className="btn-primary">View All Achievements</button>
    </div>
  );
};

export default AchievementsList; 