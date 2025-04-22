import React, { useState, useEffect } from 'react';
import './Pages.css';

const AchievementsPage = () => {
  // Dummy data for achievements
  const [achievements] = useState([
    { 
      id: 1, 
      title: '7-Day Streak', 
      description: 'Studied for 7 consecutive days', 
      date: '2023-11-10', 
      icon: '🔥',
      category: 'consistency'
    },
    { 
      id: 2, 
      title: 'Quiz Master', 
      description: 'Scored 90%+ in 3 consecutive quizzes', 
      date: '2023-11-05', 
      icon: '🏆',
      category: 'performance'
    },
    { 
      id: 3, 
      title: 'Early Bird', 
      description: 'Completed 5 study sessions before 9am', 
      date: '2023-10-28', 
      icon: '🌅',
      category: 'consistency'
    },
    { 
      id: 4, 
      title: 'Topic Champion', 
      description: 'Mastered all aspects of "Data Structures"', 
      date: '2023-10-20', 
      icon: '🥇',
      category: 'mastery'
    },
    { 
      id: 5, 
      title: 'Knowledge Explorer', 
      description: 'Studied topics from 5 different domains', 
      date: '2023-10-15', 
      icon: '🧭',
      category: 'exploration'
    },
    { 
      id: 6, 
      title: '30-Day Streak', 
      description: 'Studied for 30 consecutive days', 
      date: '2023-09-28', 
      icon: '🔥',
      category: 'consistency'
    },
    { 
      id: 7, 
      title: 'Night Owl', 
      description: 'Completed 10 study sessions after 8pm', 
      date: '2023-09-15', 
      icon: '🦉',
      category: 'consistency'
    },
    { 
      id: 8, 
      title: 'Perfect Score', 
      description: 'Achieved 100% in a test/quiz', 
      date: '2023-09-05', 
      icon: '💯',
      category: 'performance'
    }
  ]);

  // Current streak information
  const [streakInfo] = useState({
    currentStreak: 12,
    longestStreak: 30,
    totalStudyDays: 67
  });

  // Filter achievements by category
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="page-container">
      <h1>Achievements & Badges</h1>
      
      <div className="streak-info">
        <div className="streak-item">
          <div className="streak-value">{streakInfo.currentStreak}</div>
          <div className="streak-label">Current Streak</div>
        </div>
        
        <div className="streak-item">
          <div className="streak-value">{streakInfo.longestStreak}</div>
          <div className="streak-label">Longest Streak</div>
        </div>
        
        <div className="streak-item">
          <div className="streak-value">{streakInfo.totalStudyDays}</div>
          <div className="streak-label">Total Study Days</div>
        </div>
      </div>
      
      <div className="category-filter">
        <button 
          className={selectedCategory === 'all' ? 'active' : ''} 
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <button 
          className={selectedCategory === 'consistency' ? 'active' : ''} 
          onClick={() => setSelectedCategory('consistency')}
        >
          Consistency
        </button>
        <button 
          className={selectedCategory === 'performance' ? 'active' : ''} 
          onClick={() => setSelectedCategory('performance')}
        >
          Performance
        </button>
        <button 
          className={selectedCategory === 'mastery' ? 'active' : ''} 
          onClick={() => setSelectedCategory('mastery')}
        >
          Mastery
        </button>
        <button 
          className={selectedCategory === 'exploration' ? 'active' : ''} 
          onClick={() => setSelectedCategory('exploration')}
        >
          Exploration
        </button>
      </div>
      
      <div className="achievements-grid">
        {filteredAchievements.map(achievement => (
          <div key={achievement.id} className={`achievement-card ${achievement.category}`}>
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-content">
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <span className="achievement-date">Earned: {achievement.date}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="next-achievements">
        <h2>Next Achievements</h2>
        <div className="next-achievements-list">
          <div className="next-achievement-item">
            <div className="next-achievement-icon locked">🔒</div>
            <div className="next-achievement-content">
              <h3>Knowledge Master</h3>
              <p>Complete all topics in a learning track</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <span className="progress-text">60% Complete</span>
            </div>
          </div>
          
          <div className="next-achievement-item">
            <div className="next-achievement-icon locked">🔒</div>
            <div className="next-achievement-content">
              <h3>Focused Learner</h3>
              <p>Study for more than 2 hours in a single session</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="progress-text">75% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage; 