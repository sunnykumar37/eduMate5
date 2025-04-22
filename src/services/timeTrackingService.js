// We're providing a simple localStorage-based implementation without Firebase dependencies
// This avoids errors when Firebase is not set up

// Local storage keys
const ACTIVE_SESSION_KEY = 'eduMate_activeSession';
const SESSION_LOGS_KEY = 'eduMate_sessionLogs';

/**
 * Check if there's an active study session
 * @returns {Object|null} The active session or null if none exists
 */
export const getActiveSession = () => {
  const activeSessionData = localStorage.getItem(ACTIVE_SESSION_KEY);
  return activeSessionData ? JSON.parse(activeSessionData) : null;
};

/**
 * Start a new study session
 * @param {string} topic - The topic being studied
 * @returns {Object} The newly created session
 */
export const startSession = (topic) => {
  // If there's already an active session, end it first
  const existingSession = getActiveSession();
  if (existingSession) {
    endSession();
  }

  const newSession = {
    id: Date.now(),
    topic: topic.trim(),
    startTime: new Date().toISOString(),
    endTime: null
  };

  // Save to local storage
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(newSession));
  return newSession;
};

/**
 * End the current active study session
 * @returns {Object|null} The ended session, or null if no active session
 */
export const endSession = () => {
  const activeSession = getActiveSession();
  if (!activeSession) return null;

  // Set end time
  activeSession.endTime = new Date().toISOString();
  
  // Calculate duration in minutes
  const startTime = new Date(activeSession.startTime);
  const endTime = new Date(activeSession.endTime);
  const durationMs = endTime - startTime;
  activeSession.durationMinutes = Math.round(durationMs / 60000);

  // Remove from active session
  localStorage.removeItem(ACTIVE_SESSION_KEY);

  // Add to session logs
  const logs = getSessionLogs();
  logs.push(activeSession);
  localStorage.setItem(SESSION_LOGS_KEY, JSON.stringify(logs));

  return activeSession;
};

/**
 * Get all stored session logs
 * @returns {Array} Array of session log objects
 */
export const getSessionLogs = () => {
  const logsData = localStorage.getItem(SESSION_LOGS_KEY);
  return logsData ? JSON.parse(logsData) : [];
};

/**
 * Get total study time in minutes
 * @returns {number} Total minutes studied
 */
export const getTotalStudyTime = () => {
  const logs = getSessionLogs();
  return logs.reduce((total, session) => total + (session.durationMinutes || 0), 0);
};

/**
 * Generate topic-based summaries from session logs
 * @returns {Array} Array of topic summary objects
 */
export const getTopicSummaries = () => {
  const logs = getSessionLogs();
  const topicMap = {};

  // Group sessions by topic
  logs.forEach(session => {
    if (!session.topic || !session.durationMinutes) return;
    
    if (!topicMap[session.topic]) {
      topicMap[session.topic] = {
        topic: session.topic,
        totalSessions: 0,
        totalMinutes: 0,
        lastStudied: null,
        averageSessionLength: 0,
        // Additional properties for second implementation compatibility
        sessionCount: 0,
        totalTime: 0
      };
    }

    const topicData = topicMap[session.topic];
    topicData.totalSessions += 1;
    topicData.sessionCount += 1;
    topicData.totalMinutes += session.durationMinutes;
    topicData.totalTime += session.durationMinutes * 60000; // Convert to ms for second implementation
    
    const sessionDate = new Date(session.endTime);
    if (!topicData.lastStudied || sessionDate > new Date(topicData.lastStudied)) {
      topicData.lastStudied = session.endTime;
    }
  });

  // Calculate averages and format as array
  return Object.values(topicMap).map(topic => {
    topic.averageSessionLength = Math.round(topic.totalMinutes / topic.totalSessions);
    return topic;
  });
};

/**
 * Analyze study patterns to identify potential learning gaps
 * @returns {Array} Array of gap analysis objects with suggestions
 */
export const analyzeGaps = () => {
  const topics = getTopicSummaries();
  const logs = getSessionLogs();
  const gaps = [];
  const now = new Date();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  
  // Look for topics not studied recently
  topics.forEach(topic => {
    const lastStudiedDate = new Date(topic.lastStudied);
    const daysSinceStudied = Math.floor((now - lastStudiedDate) / (24 * 60 * 60 * 1000));
    
    if (daysSinceStudied > 7) {
      gaps.push({
        topic: topic.topic,
        type: 'recency',
        daysSinceStudied,
        suggestion: `It's been ${daysSinceStudied} days since you studied ${topic.topic}. Consider reviewing this topic soon.`
      });
    }
  });
  
  // Look for topics with short session times
  topics.forEach(topic => {
    if (topic.averageSessionLength < 15 && topic.totalSessions > 1) {
      gaps.push({
        topic: topic.topic,
        type: 'duration',
        avgLength: topic.averageSessionLength,
        suggestion: `Your study sessions for ${topic.topic} average only ${topic.averageSessionLength} minutes. Consider longer, more focused sessions.`
      });
    }
  });
  
  // Look for topics with infrequent study
  if (logs.length > 5) {
    const recentLogs = logs.filter(log => new Date(log.endTime) > new Date(now - oneWeekMs));
    const recentTopics = new Set(recentLogs.map(log => log.topic));
    
    topics.forEach(topic => {
      if (!recentTopics.has(topic.topic) && topic.totalSessions < 3) {
        gaps.push({
          topic: topic.topic,
          type: 'frequency',
          totalSessions: topic.totalSessions,
          suggestion: `You've only studied ${topic.topic} ${topic.totalSessions} times total. Consider scheduling regular sessions.`
        });
      }
    });
  }
  
  return gaps;
};

/**
 * Format a date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format elapsed time in minutes and seconds
 * @param {number} seconds - Total seconds elapsed
 * @returns {string} Formatted time string
 */
export const formatElapsedTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Clear all time tracking data (for testing/reset purposes)
 */
export const clearAllData = () => {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
  localStorage.removeItem(SESSION_LOGS_KEY);
};

/**
 * Format milliseconds into a readable time string
 * @param {number} ms Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTime = (ms) => {
  if (!ms) return '0m';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  let formattedTime = '';
  
  if (hours > 0) {
    formattedTime += `${hours}h `;
  }
  
  if (minutes > 0 || hours > 0) {
    formattedTime += `${minutes}m `;
  }
  
  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    formattedTime += `${seconds}s`;
  }
  
  return formattedTime.trim();
};

// Firebase-specific function stubs - These would normally use Firebase
// but for now they'll just use localStorage
export const startLearningSession = async (topicId, topicName) => {
  // For now, just use the regular startSession
  const session = startSession(topicName);
  return session.id;
};

export const endLearningSession = async () => {
  // For now, just use the regular endSession
  return endSession();
};

export const getLearningSessionsByUser = async () => {
  // For now, just use the regular getSessionLogs
  return getSessionLogs();
};

export const checkActiveSession = async () => {
  // For now, just use the regular getActiveSession
  return getActiveSession();
};

export const getLearningTimeSummary = async () => {
  // For now, just use the regular getTopicSummaries
  return getTopicSummaries();
}; 