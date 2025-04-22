import express from 'express';
import {
  startSession,
  endSession,
  getTimeSummary,
  getTimeLogs,
  getTimeByTopic,
  getRecentSessions
} from '../controllers/learningTimeController.js';

const router = express.Router();

// Start a new learning session
router.post('/start', startSession);

// End a learning session
router.put('/end/:sessionId', endSession);

// Get learning time summary
router.get('/summary', getTimeSummary);

// Get detailed learning time logs
router.get('/logs', getTimeLogs);

// Get time spent by topic
router.get('/by-topic', getTimeByTopic);

// Get recent learning sessions
router.get('/recent', getRecentSessions);

export default router; 