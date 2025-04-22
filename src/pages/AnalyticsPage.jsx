import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Pages.css';
import PerformanceChart from '../components/analytics/PerformanceChart';

const AnalyticsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('performance');
  
  useEffect(() => {
    // Check if we came from another page with an active tab set
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
      
      // Scroll to the section
      setTimeout(() => {
        const section = document.getElementById(location.state.activeTab);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  // Dummy data for the charts
  const [performanceData] = useState([
    { topic: 'Data Structures', score: 85, date: '2023-10-01' },
    { topic: 'Algorithms', score: 72, date: '2023-10-05' },
    { topic: 'Web Development', score: 90, date: '2023-10-10' },
    { topic: 'Database Systems', score: 78, date: '2023-10-15' },
    { topic: 'Machine Learning', score: 65, date: '2023-10-20' },
    { topic: 'Computer Networks', score: 82, date: '2023-10-25' },
  ]);

  const [topicTimeData] = useState([
    { topic: 'Data Structures', timeSpent: 4.5, date: '2023-10-01' },
    { topic: 'Algorithms', timeSpent: 3.2, date: '2023-10-05' },
    { topic: 'Web Development', timeSpent: 2.8, date: '2023-10-10' },
    { topic: 'Database Systems', timeSpent: 3.5, date: '2023-10-15' },
    { topic: 'Machine Learning', timeSpent: 5.0, date: '2023-10-20' },
    { topic: 'Computer Networks', timeSpent: 2.5, date: '2023-10-25' },
  ]);

  // Convert time data to format needed for chart
  const timeChartData = topicTimeData.map(item => ({
    topic: item.topic,
    score: item.timeSpent,
    date: item.date
  }));

  // Dummy learning time logs
  const [timeLogs] = useState([
    { id: 1, topic: 'Data Structures', date: '2023-10-20', duration: '1h 30m' },
    { id: 2, topic: 'Algorithms', date: '2023-10-19', duration: '45m' },
    { id: 3, topic: 'Web Development', date: '2023-10-18', duration: '2h 15m' },
    { id: 4, topic: 'Machine Learning', date: '2023-10-17', duration: '1h' },
    { id: 5, topic: 'Database Systems', date: '2023-10-16', duration: '1h 10m' }
  ]);

  // Dummy knowledge gaps with improvement suggestions
  const [knowledgeGapsWithSuggestions] = useState([
    { 
      id: 1, 
      topic: 'Advanced Algorithms', 
      score: 55, 
      recommendation: 'Review recursion and dynamic programming',
      suggestions: [
        'Complete exercises 5-10 from the Algorithms Textbook',
        'Watch the Dynamic Programming tutorial series',
        'Practice memoization techniques with coding challenges'
      ]
    },
    { 
      id: 2, 
      topic: 'Database Design', 
      score: 62, 
      recommendation: 'Practice normalization techniques',
      suggestions: [
        'Review database normalization forms (1NF through 3NF)',
        'Complete the Database Design worksheets',
        'Try implementing a normalized schema for a sample case study'
      ] 
    }
  ]);

  return (
    <div className="page-container">
      <h1>Analytics Dashboard</h1>
      
      <div className="tab-selector">
        <button 
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button 
          className={`tab-btn ${activeTab === 'timeLogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeLogs')}
        >
          Time Logs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'knowledgeGaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('knowledgeGaps')}
        >
          Knowledge Gaps
        </button>
      </div>
      
      <div className="analytics-sections">
        <section 
          id="performance" 
          className={`analytics-section ${activeTab === 'performance' ? 'active' : 'hidden'}`}
        >
          <h2>Performance Over Time</h2>
          <div className="chart-container-large">
            <PerformanceChart 
              performanceData={performanceData} 
              title="Test Scores by Topic"
            />
          </div>
        </section>
        
        <section 
          id="timeLogs"
          className={`analytics-section ${activeTab === 'timeLogs' ? 'active' : 'hidden'}`}
        >
          <h2>Learning Time Logs</h2>
          <div className="time-logs-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {timeLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.date}</td>
                    <td>{log.topic}</td>
                    <td>{log.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="chart-container-large">
            <PerformanceChart 
              performanceData={timeChartData} 
              title="Hours Spent by Topic"
            />
          </div>
        </section>
        
        <section 
          id="knowledgeGaps"
          className={`analytics-section ${activeTab === 'knowledgeGaps' ? 'active' : 'hidden'}`}
        >
          <h2>Knowledge Improvement Suggestions</h2>
          <div className="gap-suggestions">
            {knowledgeGapsWithSuggestions.map(gap => (
              <div key={gap.id} className="gap-suggestion-card">
                <div className="gap-header">
                  <h3>{gap.topic}</h3>
                  <span className={`gap-score ${gap.score < 60 ? 'score-low' : 'score-medium'}`}>
                    {gap.score}%
                  </span>
                </div>
                
                <div className="gap-recommendations">
                  <h4>Recommendations:</h4>
                  <p className="main-recommendation">{gap.recommendation}</p>
                  
                  <h4>Specific Actions:</h4>
                  <ul className="suggestion-list">
                    {gap.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsPage; 