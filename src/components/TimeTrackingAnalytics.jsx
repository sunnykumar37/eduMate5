import React, { useState, useEffect } from 'react';
import { 
  getActiveSession, 
  startSession, 
  endSession, 
  getSessionLogs, 
  getTopicSummaries, 
  analyzeGaps, 
  formatDate, 
  formatElapsedTime 
} from '../services/timeTrackingService';
import '../styles/TimeTrackingAnalytics.css';

const TimeTrackingAnalytics = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [topicInput, setTopicInput] = useState('');
  const [sessionLogs, setSessionLogs] = useState([]);
  const [topicSummaries, setTopicSummaries] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [activeTab, setActiveTab] = useState('sessions');

  // Check for active session and load data on mount
  useEffect(() => {
    const active = getActiveSession();
    setActiveSession(active);
    refreshData();
  }, []);

  // Timer for active session
  useEffect(() => {
    let timer;
    if (activeSession) {
      timer = setInterval(() => {
        const startTime = new Date(activeSession.startTime);
        const now = new Date();
        const seconds = Math.floor((now - startTime) / 1000);
        setElapsedTime(seconds);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeSession]);

  // Refresh all data from storage
  const refreshData = () => {
    const logs = getSessionLogs().sort((a, b) => 
      new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime)
    );
    setSessionLogs(logs);
    
    const topics = getTopicSummaries();
    if (topics && topics.length > 0) {
      // Check if the topics have totalMinutes property (first implementation)
      // or totalTime property (second implementation)
      const sortedTopics = topics.sort((a, b) => {
        if (a.totalMinutes && b.totalMinutes) {
          return b.totalMinutes - a.totalMinutes;
        } else if (a.totalTime && b.totalTime) {
          return b.totalTime - a.totalTime;
        }
        return 0;
      });
      setTopicSummaries(sortedTopics);
    } else {
      setTopicSummaries([]);
    }
    
    setGaps(analyzeGaps());
  };

  // Handle starting a new session
  const handleStartSession = () => {
    if (!topicInput.trim()) {
      alert('Please enter a topic for your study session');
      return;
    }
    
    const newSession = startSession(topicInput);
    setActiveSession(newSession);
    setElapsedTime(0);
    setTopicInput('');
  };

  // Handle ending the current session
  const handleEndSession = () => {
    if (activeSession) {
      endSession();
      setActiveSession(null);
      setElapsedTime(0);
      refreshData();
    }
  };

  return (
    <div className="time-tracking-analytics">
      <h2>Time Tracking &amp; Analytics</h2>
      
      {/* Active Session Section */}
      <div className="current-session-container">
        {activeSession ? (
          <div className="current-session">
            <h3>Active Session: {activeSession.topic}</h3>
            <div className="elapsed-time">{formatElapsedTime(elapsedTime)}</div>
            <button 
              className="btn-end-session"
              onClick={handleEndSession}
            >
              End Session
            </button>
          </div>
        ) : (
          <div className="new-session">
            <h3>Start a New Study Session</h3>
            <div className="input-group">
              <input
                type="text"
                className="topic-input"
                placeholder="What are you studying?"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
              />
              <button 
                className="btn-start-session"
                onClick={handleStartSession}
              >
                Start Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Tabs */}
      <div className="analytics-tabs">
        <div 
          className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          Session Logs
        </div>
        <div 
          className={`tab ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          Topic Summaries
        </div>
        <div 
          className={`tab ${activeTab === 'gaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('gaps')}
        >
          Gap Analysis
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Session Logs */}
        {activeTab === 'sessions' && (
          <div className="session-logs">
            <h3>Your Study Sessions</h3>
            {sessionLogs.length === 0 ? (
              <p className="empty-state">No study sessions recorded yet. Start your first session above!</p>
            ) : (
              <ul className="logs-list">
                {sessionLogs.map(session => (
                  <li key={session.id} className="session-log-item">
                    <div className="session-topic">{session.topic}</div>
                    <div className="session-time">
                      {formatDate(session.startTime)}
                      {session.endTime && ` (${session.durationMinutes || Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)} min)`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Topic Summaries */}
        {activeTab === 'topics' && (
          <div className="topic-summaries">
            <h3>Topic Analysis</h3>
            {topicSummaries.length === 0 ? (
              <p className="empty-state">No completed study sessions yet. Complete a session to see topic analysis.</p>
            ) : (
              <ul className="topics-list">
                {topicSummaries.map(topic => (
                  <li key={topic.topic} className="topic-summary-item">
                    <div className="topic-name">{topic.topic}</div>
                    <div className="topic-stats">
                      <span>Total: {topic.totalMinutes || Math.round(topic.totalTime / 60000) || 0} min</span> | 
                      <span>Sessions: {topic.totalSessions || topic.sessionCount || 0}</span> | 
                      <span>Avg: {topic.averageSessionLength || (topic.totalSessions ? Math.round((topic.totalTime / 60000) / topic.sessionCount) : 0)} min/session</span>
                    </div>
                    <div className="last-studied">
                      Last studied: {formatDate(topic.lastStudied)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Gap Analysis */}
        {activeTab === 'gaps' && (
          <div className="gap-analysis">
            <h3>Study Gap Analysis</h3>
            {gaps.length === 0 ? (
              <p className="empty-state">No study gaps identified yet. Complete more sessions for gap analysis.</p>
            ) : (
              <ul className="gaps-list">
                {gaps.map((gap, index) => (
                  <li key={index} className="gap-item">
                    <div className="gap-topic">{gap.topic}</div>
                    <div className="gap-suggestion">{gap.suggestion}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTrackingAnalytics; 