import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AnalyticsComponents.css';

const LearningTimeSummary = ({ data }) => {
  const navigate = useNavigate();

  const handleViewFullLogs = () => {
    navigate('/analytics', { state: { activeTab: 'timeLogs' } });
  };

  return (
    <div className="analytics-card">
      <h2>Learning Time Summary</h2>
      
      <div className="analytics-stats">
        <div className="stat-item">
          <span className="stat-label">Weekly Total</span>
          <span className="stat-value">{data.weeklyTotal} hours</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Daily Average</span>
          <span className="stat-value">{data.dailyAverage} hours</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Most Studied Topic</span>
          <span className="stat-value">{data.mostStudiedTopic}</span>
        </div>
      </div>
      
      <div className="topic-list">
        <h3>Recent Topics</h3>
        <ul>
          {data.recentTopics.map(topic => (
            <li key={topic.id} className="topic-item">
              <span className="topic-name">{topic.name}</span>
              <span className="topic-time">{topic.timeSpent} hours</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button className="btn-primary" onClick={handleViewFullLogs}>View Full Time Logs</button>
    </div>
  );
};

export default LearningTimeSummary; 