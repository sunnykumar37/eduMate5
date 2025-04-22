import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AnalyticsComponents.css';

const KnowledgeGaps = ({ gaps }) => {
  const navigate = useNavigate();

  const handleViewSuggestions = () => {
    navigate('/analytics', { state: { activeTab: 'knowledgeGaps' } });
  };

  return (
    <div className="analytics-card">
      <h2>Knowledge Gaps</h2>
      
      {gaps.length > 0 ? (
        <div className="gap-list">
          {gaps.map(gap => (
            <div key={gap.id} className="gap-item">
              <div className="gap-header">
                <h3>{gap.topic}</h3>
                <span className={`gap-score ${gap.score < 60 ? 'score-low' : 'score-medium'}`}>
                  {gap.score}%
                </span>
              </div>
              
              <div className="gap-recommendation">
                <h4>Recommendation:</h4>
                <p>{gap.recommendation}</p>
              </div>
              
              <div className="gap-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${gap.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No knowledge gaps detected!</p>
          <p>Keep up the good work.</p>
        </div>
      )}
      
      <button className="btn-primary" onClick={handleViewSuggestions}>View Improvement Suggestions</button>
    </div>
  );
};

export default KnowledgeGaps; 