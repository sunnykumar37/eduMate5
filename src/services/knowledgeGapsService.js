import axios from 'axios';

const API_URL = '/api/knowledge-gaps';

// Get all detected knowledge gaps
export const getKnowledgeGaps = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching knowledge gaps:', error);
    throw error;
  }
};

// Get knowledge gaps for a specific topic
export const getKnowledgeGapsByTopic = async (topicId) => {
  try {
    const response = await axios.get(`${API_URL}/topic/${topicId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching knowledge gaps by topic:', error);
    throw error;
  }
};

// Get improvement recommendations for knowledge gaps
export const getImprovementRecommendations = async (gapId) => {
  try {
    const response = await axios.get(`${API_URL}/${gapId}/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching improvement recommendations:', error);
    throw error;
  }
};

// Update a knowledge gap's status (e.g., when addressing it)
export const updateKnowledgeGapStatus = async (gapId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${gapId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating knowledge gap status:', error);
    throw error;
  }
};

// Analyze a test result to detect knowledge gaps
export const analyzeTestResult = async (testData) => {
  try {
    const response = await axios.post(`${API_URL}/analyze`, testData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing test result:', error);
    throw error;
  }
}; 