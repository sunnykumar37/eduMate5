import React, { useState, useEffect } from 'react';
import { startLearningSession, endLearningSession, getActiveSession, formatElapsedTime } from '../../services/timeTrackingService';
import './Learning.css';

const TimeTracker = ({ topicId, topicName }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // Check for active session on mount
  useEffect(() => {
    const activeSession = getActiveSession();
    if (activeSession && activeSession.topic === topicName) {
      setIsTracking(true);
      setSessionId(activeSession.id);
      setStartTime(new Date(activeSession.startTime));
      
      // Calculate elapsed time
      const startTimeMs = new Date(activeSession.startTime).getTime();
      const currentTimeMs = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTimeMs - startTimeMs) / 1000);
      setElapsedTime(elapsedSeconds);
      
      // Start the timer
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      setTimerInterval(interval);
    }
  }, [topicName]);

  // Format seconds into HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Start tracking time
  const startTracking = async () => {
    try {
      const sessionId = await startLearningSession(topicId, topicName);
      setSessionId(sessionId);
      setStartTime(new Date());
      setIsTracking(true);
      
      // Start the timer
      const interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
      
      setTimerInterval(interval);
    } catch (error) {
      console.error('Failed to start time tracking:', error);
    }
  };

  // Stop tracking time
  const stopTracking = async () => {
    try {
      await endLearningSession();
      setIsTracking(false);
      
      // Clear the timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      // Reset values
      setSessionId(null);
      setStartTime(null);
      setElapsedTime(0);
    } catch (error) {
      console.error('Failed to end time tracking:', error);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // If still tracking when component unmounts, end the session
      if (isTracking) {
        endLearningSession().catch(error => {
          console.error('Failed to end session on unmount:', error);
        });
      }
    };
  }, [isTracking, timerInterval]);

  return (
    <div className="time-tracker">
      <div className="time-tracker-header">
        <h3>Time Tracker</h3>
        <span className="topic-name">{topicName}</span>
      </div>
      
      <div className="time-display">
        <span className="time">{formatTime(elapsedTime)}</span>
      </div>
      
      <div className="tracker-controls">
        {!isTracking ? (
          <button 
            className="btn-primary start-btn" 
            onClick={startTracking}
          >
            Start Learning
          </button>
        ) : (
          <button 
            className="btn-secondary stop-btn" 
            onClick={stopTracking}
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeTracker; 