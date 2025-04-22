import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// Components
import LearningTimeSummary from '../components/analytics/LearningTimeSummary';
import PerformanceOverview from '../components/analytics/PerformanceOverview';
import KnowledgeGaps from '../components/analytics/KnowledgeGaps';
import AchievementsList from '../components/achievements/AchievementsList';

// Dummy data (will be replaced with API calls)
const dummyTimeData = {
  weeklyTotal: 12.5,
  dailyAverage: 2.1,
  mostStudiedTopic: 'Data Structures',
  recentTopics: [
    { id: 1, name: 'Data Structures', timeSpent: 4.5 },
    { id: 2, name: 'Algorithms', timeSpent: 3.2 },
    { id: 3, name: 'Web Development', timeSpent: 2.8 },
    { id: 4, name: 'Machine Learning', timeSpent: 2.0 }
  ]
};

const dummyPerformanceData = {
  testsTaken: 12,
  averageScore: 78,
  highestScore: 95,
  recentTests: [
    { id: 1, topic: 'Data Structures', score: 85 },
    { id: 2, topic: 'Algorithms', score: 72 },
    { id: 3, topic: 'Web Development', score: 90 }
  ]
};

const dummyKnowledgeGaps = [
  { id: 1, topic: 'Advanced Algorithms', score: 55, recommendation: 'Review recursion and dynamic programming' },
  { id: 2, topic: 'Database Design', score: 62, recommendation: 'Practice normalization techniques' }
];

const dummyAchievements = [
  { id: 1, title: '7-Day Streak', description: 'Studied for 7 consecutive days', date: '2023-11-10', icon: '🔥' },
  { id: 2, title: 'Quiz Master', description: 'Scored 90%+ in 3 consecutive quizzes', date: '2023-11-05', icon: '🏆' }
];

const Dashboard = () => {
  const [timeData, setTimeData] = useState(dummyTimeData);
  const [performanceData, setPerformanceData] = useState(dummyPerformanceData);
  const [knowledgeGaps, setKnowledgeGaps] = useState(dummyKnowledgeGaps);
  const [achievements, setAchievements] = useState(dummyAchievements);

  // In a real app, we would fetch this data from APIs
  useEffect(() => {
    // Example API calls (commented out)
    // async function fetchData() {
    //   const timeResponse = await fetch('/api/learning-time/summary');
    //   const timeData = await timeResponse.json();
    //   setTimeData(timeData);
    //
    //   const performanceResponse = await fetch('/api/performance/summary');
    //   const performanceData = await performanceResponse.json();
    //   setPerformanceData(performanceData);
    //
    //   const gapsResponse = await fetch('/api/knowledge-gaps');
    //   const gapsData = await gapsResponse.json();
    //   setKnowledgeGaps(gapsData);
    //
    //   const achievementsResponse = await fetch('/api/achievements/recent');
    //   const achievementsData = await achievementsResponse.json();
    //   setAchievements(achievementsData);
    // }
    //
    // fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Learning Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="grid-item">
          <LearningTimeSummary data={timeData} />
        </div>
        
        <div className="grid-item">
          <PerformanceOverview data={performanceData} />
        </div>
        
        <div className="grid-item">
          <KnowledgeGaps gaps={knowledgeGaps} />
        </div>
        
        <div className="grid-item">
          <AchievementsList achievements={achievements} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 