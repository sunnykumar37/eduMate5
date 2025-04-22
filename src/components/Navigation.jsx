import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="sidebar">
      <div className="logo">
        <h2>eduMate</h2>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/learning-tracks" className={({ isActive }) => isActive ? 'active' : ''}>
            Learning Tracks
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
            Analytics
          </NavLink>
        </li>
        <li>
          <NavLink to="/achievements" className={({ isActive }) => isActive ? 'active' : ''}>
            Achievements
          </NavLink>
        </li>
        <li>
          <NavLink to="/cv-generator" className={({ isActive }) => isActive ? 'active' : ''}>
            CV Generator
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 