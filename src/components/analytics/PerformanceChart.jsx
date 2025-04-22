import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './AnalyticsComponents.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChart = ({ performanceData, title }) => {
  const [chartType, setChartType] = useState('line');
  
  // Prepare the data for Chart.js
  const chartData = {
    labels: performanceData.map(item => item.date || item.topic),
    datasets: [
      {
        label: 'Score (%)',
        data: performanceData.map(item => item.score),
        backgroundColor: 'rgba(63, 81, 181, 0.5)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 2,
        fill: chartType === 'line' ? 'origin' : false,
        tension: 0.3,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: title ? true : false,
        text: title,
        font: {
          size: 16,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Topics / Date',
        },
      },
    },
  };

  // Render the selected chart type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} height={300} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} height={300} />;
      default:
        return <Line data={chartData} options={chartOptions} height={300} />;
    }
  };

  return (
    <div className="performance-chart-container">
      <div className="chart-controls">
        <div className="chart-type-selector">
          <button 
            className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`} 
            onClick={() => setChartType('line')}
          >
            Line Chart
          </button>
          <button 
            className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
        </div>
      </div>
      <div className="chart-wrapper">
        {renderChart()}
      </div>
    </div>
  );
};

export default PerformanceChart; 