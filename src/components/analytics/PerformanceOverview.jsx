import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AnalyticsComponents.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceOverview = ({ data }) => {
  const navigate = useNavigate();

  const handleViewAllTestResults = () => {
    navigate('/analytics', { state: { activeTab: 'performance' } });
  };

  // Prepare chart data
  const chartData = {
    labels: data.recentTests.map(test => test.topic),
    datasets: [
      {
        label: 'Test Score (%)',
        data: data.recentTests.map(test => test.score),
        backgroundColor: 'rgba(63, 81, 181, 0.7)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="analytics-card">
      <h2>Performance Overview</h2>
      
      <div className="analytics-stats">
        <div className="stat-item">
          <span className="stat-label">Tests Taken</span>
          <span className="stat-value">{data.testsTaken}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Average Score</span>
          <span className="stat-value">{data.averageScore}%</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Highest Score</span>
          <span className="stat-value">{data.highestScore}%</span>
        </div>
      </div>
      
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} height={200} />
      </div>
      
      <button className="btn-primary" onClick={handleViewAllTestResults}>View All Test Results</button>
    </div>
  );
};

export default PerformanceOverview; 