import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navigation from './components/Navigation';
import CvGenerator from './components/cv/CvGenerator';
import AnalyticsPage from './pages/AnalyticsPage';
import LearningTracksPage from './pages/LearningTracksPage';
import AchievementsPage from './pages/AchievementsPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learning-tracks" element={<LearningTracksPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/cv-generator" element={<CvGenerator />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 