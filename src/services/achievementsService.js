import axios from 'axios';

const API_URL = '/api/achievements';

// Get all user achievements
export const getAllAchievements = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};

// Get recent achievements
export const getRecentAchievements = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/recent`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent achievements:', error);
    throw error;
  }
};

// Get user streak information
export const getStreakInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/streak`);
    return response.data;
  } catch (error) {
    console.error('Error fetching streak info:', error);
    throw error;
  }
};

// Get possible achievements (ones the user can work towards)
export const getPossibleAchievements = async () => {
  try {
    const response = await axios.get(`${API_URL}/possible`);
    return response.data;
  } catch (error) {
    console.error('Error fetching possible achievements:', error);
    throw error;
  }
};

// Check for new achievements (call after completing a session or quiz)
export const checkForNewAchievements = async () => {
  try {
    const response = await axios.post(`${API_URL}/check`);
    return response.data;
  } catch (error) {
    console.error('Error checking for new achievements:', error);
    throw error;
  }
};

// Mark an achievement as viewed (to clear notification)
export const markAchievementAsViewed = async (achievementId) => {
  try {
    const response = await axios.put(`${API_URL}/${achievementId}/viewed`);
    return response.data;
  } catch (error) {
    console.error('Error marking achievement as viewed:', error);
    throw error;
  }
}; 