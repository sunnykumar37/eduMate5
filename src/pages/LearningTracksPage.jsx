import React, { useState, useEffect } from 'react';
import './Pages.css';
import TimeTracker from '../components/learning/TimeTracker';
import { getActiveSession } from '../services/timeTrackingService';

const LearningTracksPage = () => {
  // Dummy data for learning tracks
  const [tracks, setTracks] = useState([
    {
      id: 1,
      title: 'Web Development',
      progress: 65,
      topics: [
        { id: 101, name: 'HTML & CSS Basics', completed: true },
        { id: 102, name: 'JavaScript Fundamentals', completed: true },
        { id: 103, name: 'React Framework', completed: false, current: true },
        { id: 104, name: 'Backend Development', completed: false },
        { id: 105, name: 'Database Integration', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      progress: 40,
      topics: [
        { id: 201, name: 'Arrays and Strings', completed: true },
        { id: 202, name: 'Linked Lists', completed: true },
        { id: 203, name: 'Trees and Graphs', completed: false, current: true },
        { id: 204, name: 'Dynamic Programming', completed: false },
        { id: 205, name: 'Advanced Algorithms', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Machine Learning',
      progress: 20,
      topics: [
        { id: 301, name: 'Python for Data Science', completed: true },
        { id: 302, name: 'Data Preprocessing', completed: false, current: true },
        { id: 303, name: 'Supervised Learning', completed: false },
        { id: 304, name: 'Unsupervised Learning', completed: false },
        { id: 305, name: 'Neural Networks', completed: false }
      ]
    }
  ]);

  // Check for active session on mount
  useEffect(() => {
    const activeSession = getActiveSession();
    if (activeSession) {
      // Try to find which topic matches the active session
      const activeTopic = activeSession.topic;
      
      // Update tracks to mark the correct topic as current
      setTracks(prevTracks => 
        prevTracks.map(track => ({
          ...track,
          topics: track.topics.map(topic => ({
            ...topic,
            current: topic.name === activeTopic
          }))
        }))
      );
    }
  }, []);

  // Get the current topic for time tracking
  const currentTrack = tracks.find(track => 
    track.topics.some(topic => topic.current)
  );
  
  const currentTopic = currentTrack 
    ? currentTrack.topics.find(topic => topic.current) 
    : null;

  const handleContinueLearning = (trackId) => {
    // Update the tracks to set only one current topic
    setTracks(prevTracks => 
      prevTracks.map(track => ({
        ...track,
        topics: track.topics.map(topic => ({
          ...topic,
          current: track.id === trackId ? topic.current : false
        }))
      }))
    );

    // Scroll to the time tracker
    document.querySelector('.time-tracking-panel').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleStartLearning = (trackId, topicId) => {
    // Update all tracks to set only this topic as current
    setTracks(prevTracks => 
      prevTracks.map(track => ({
        ...track,
        topics: track.topics.map(topic => ({
          ...topic,
          current: track.id === trackId && topic.id === topicId
        }))
      }))
    );

    // Scroll to the time tracker
    document.querySelector('.time-tracking-panel').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="page-container">
      <h1>Learning Tracks</h1>
      
      <div className="learning-tracks-grid">
        <div className="tracks-list">
          {tracks.map(track => (
            <div key={track.id} className="track-card">
              <h2>{track.title}</h2>
              
              <div className="track-progress">
                <div className="progress-label">
                  <span>Progress: {track.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${track.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="track-topics">
                <h3>Topics</h3>
                <ul>
                  {track.topics.map(topic => (
                    <li 
                      key={topic.id} 
                      className={`
                        ${topic.completed ? 'completed' : ''} 
                        ${topic.current ? 'current' : ''}
                      `}
                      onClick={() => handleStartLearning(track.id, topic.id)}
                    >
                      {topic.name}
                      {topic.completed && <span className="check-icon">✓</span>}
                      {topic.current && <span className="current-icon">→</span>}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                className="btn-primary"
                onClick={() => handleContinueLearning(track.id)}
              >
                Continue Learning
              </button>
            </div>
          ))}
        </div>
        
        <div className="time-tracking-panel">
          {currentTopic ? (
            <TimeTracker 
              topicId={currentTopic.id} 
              topicName={currentTopic.name} 
            />
          ) : (
            <div className="no-current-topic">
              <h3>No Active Topic</h3>
              <p>Select a topic to start tracking your learning time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningTracksPage; 