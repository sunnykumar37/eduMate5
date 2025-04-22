import LearningSession from '../models/LearningSession.js';
import mongoose from 'mongoose';

// Start a new learning session
export const startSession = async (req, res) => {
  try {
    const { topicId } = req.body;
    
    // In a real app, get userId from authenticated user
    const userId = req.body.userId || '6481a5aef38231c5502593f7'; // Dummy ID for testing
    
    const newSession = new LearningSession({
      userId,
      topicId,
      startTime: new Date()
    });
    
    await newSession.save();
    
    res.status(201).json({
      success: true,
      sessionId: newSession._id,
      message: 'Learning session started successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting learning session',
      error: error.message
    });
  }
};

// End a learning session
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await LearningSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    if (session.completed) {
      return res.status(400).json({
        success: false,
        message: 'Session already completed'
      });
    }
    
    session.endTime = new Date();
    await session.save();
    
    res.status(200).json({
      success: true,
      duration: session.duration,
      message: 'Learning session ended successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error ending learning session',
      error: error.message
    });
  }
};

// Get learning time summary
export const getTimeSummary = async (req, res) => {
  try {
    // In a real app, get userId from authenticated user
    const userId = req.query.userId || '6481a5aef38231c5502593f7'; // Dummy ID for testing
    
    const todaySeconds = await LearningSession.getTodayTimeForUser(userId);
    const weekSeconds = await LearningSession.getWeekTimeForUser(userId);
    
    // Get most studied topic
    const mostStudiedTopic = await LearningSession.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          completed: true
        }
      },
      {
        $group: {
          _id: "$topicId",
          totalDuration: { $sum: "$duration" }
        }
      },
      {
        $sort: { totalDuration: -1 }
      },
      {
        $limit: 1
      },
      {
        $lookup: {
          from: 'topics',
          localField: '_id',
          foreignField: '_id',
          as: 'topic'
        }
      }
    ]);
    
    // Get recent topics
    const recentTopics = await LearningSession.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          completed: true
        }
      },
      {
        $sort: { endTime: -1 }
      },
      {
        $group: {
          _id: "$topicId",
          lastStudied: { $first: "$endTime" },
          totalDuration: { $sum: "$duration" }
        }
      },
      {
        $sort: { lastStudied: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'topics',
          localField: '_id',
          foreignField: '_id',
          as: 'topic'
        }
      }
    ]);
    
    // Format the results
    // In a real app, we would actually get topic names from the database
    // Here we're using dummy data since we don't have the Topics collection
    const formattedTopics = recentTopics.map((item, index) => ({
      id: index + 1,
      name: ['Data Structures', 'Algorithms', 'Web Development', 'Machine Learning', 'Database Systems'][index],
      timeSpent: parseFloat((item.totalDuration / 3600).toFixed(1)) // Convert to hours
    }));
    
    res.status(200).json({
      success: true,
      weeklyTotal: parseFloat((weekSeconds / 3600).toFixed(1)), // Convert to hours
      dailyAverage: parseFloat(((weekSeconds / 7) / 3600).toFixed(1)), // Convert to hours
      mostStudiedTopic: mostStudiedTopic.length > 0 ? 'Data Structures' : 'No topics studied yet',
      recentTopics: formattedTopics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching learning time summary',
      error: error.message
    });
  }
};

// Get detailed learning time logs
export const getTimeLogs = async (req, res) => {
  try {
    // In a real app, get userId from authenticated user
    const userId = req.query.userId || '6481a5aef38231c5502593f7'; // Dummy ID for testing
    
    const { startDate, endDate, topicId } = req.query;
    
    const query = {
      userId: mongoose.Types.ObjectId(userId),
      completed: true
    };
    
    if (startDate) {
      query.startTime = { $gte: new Date(startDate) };
    }
    
    if (endDate) {
      query.endTime = { ...query.endTime, $lte: new Date(endDate) };
    }
    
    if (topicId) {
      query.topicId = mongoose.Types.ObjectId(topicId);
    }
    
    const logs = await LearningSession.find(query)
      .sort({ startTime: -1 })
      .lean();
    
    // Format the results
    // In a real app, we would join with Topics collection
    const formattedLogs = logs.map(log => ({
      id: log._id,
      topic: 'Dummy Topic Name', // Would come from Topics collection
      startTime: log.startTime,
      endTime: log.endTime,
      duration: log.duration,
      durationHours: parseFloat((log.duration / 3600).toFixed(2))
    }));
    
    res.status(200).json({
      success: true,
      logs: formattedLogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching learning time logs',
      error: error.message
    });
  }
};

// Get time spent by topic
export const getTimeByTopic = async (req, res) => {
  try {
    // In a real app, get userId from authenticated user
    const userId = req.query.userId || '6481a5aef38231c5502593f7'; // Dummy ID for testing
    
    const timeByTopic = await LearningSession.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          completed: true
        }
      },
      {
        $group: {
          _id: "$topicId",
          totalDuration: { $sum: "$duration" }
        }
      },
      {
        $sort: { totalDuration: -1 }
      },
      {
        $lookup: {
          from: 'topics',
          localField: '_id',
          foreignField: '_id',
          as: 'topic'
        }
      }
    ]);
    
    // Format the results
    // In a real app, we would actually get topic names from the database
    // Here we're using dummy data since we don't have the Topics collection
    const dummyTopics = [
      'Data Structures',
      'Algorithms',
      'Web Development',
      'Machine Learning',
      'Database Systems',
      'Computer Networks',
      'Operating Systems',
      'Computer Architecture'
    ];
    
    const formattedTimeByTopic = dummyTopics.map((topic, index) => ({
      id: index + 1,
      name: topic,
      timeSpent: parseFloat(((Math.random() * 10) + 1).toFixed(1)), // Random hours between 1-11
      percentage: parseFloat(((Math.random() * 30) + 5).toFixed(1)) // Random percentage between 5-35%
    }));
    
    res.status(200).json({
      success: true,
      timeByTopic: formattedTimeByTopic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching time by topic',
      error: error.message
    });
  }
};

// Get recent sessions
export const getRecentSessions = async (req, res) => {
  try {
    // In a real app, get userId from authenticated user
    const userId = req.query.userId || '6481a5aef38231c5502593f7'; // Dummy ID for testing
    
    const limit = parseInt(req.query.limit) || 5;
    
    const recentSessions = await LearningSession.find({
      userId,
      completed: true
    })
      .sort({ endTime: -1 })
      .limit(limit)
      .lean();
    
    // Format the results
    // In a real app, we would join with Topics collection
    const formattedSessions = recentSessions.map((session, index) => ({
      id: session._id,
      topic: ['Data Structures', 'Algorithms', 'Web Development', 'Machine Learning', 'Database Systems'][index % 5], // Dummy topic name
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      durationHours: parseFloat((session.duration / 3600).toFixed(2))
    }));
    
    res.status(200).json({
      success: true,
      sessions: formattedSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent sessions',
      error: error.message
    });
  }
}; 