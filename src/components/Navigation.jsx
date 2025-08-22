/**
 * Navigation Component
 * Renders the main navigation menu for switching between different features
 * Uses a clean, responsive design with active state indicators
 */

import React from 'react';

const Navigation = ({ activeOption, setActiveOption }) => {
  // Available navigation options with their display names
  const options = [
    { key: "career", label: "Career Guidance" },
    { key: "resume", label: "Resume Analysis" },
    { key: "learning", label: "Learning Path" },
    { key: "interview", label: "Mock Interview" },
    { key: "insights", label: "Job Market Insights" },
    { key: "networking", label: "Networking" }
  ];

  return (
    <div className="nav-container">
      <h2 className="text-xl font-bold text-center text-primary-900 mb-4">
        Navigation
      </h2>
      <ul className="nav-list">
        {options.map((option) => (
          <li
            key={option.key}
            className={`nav-item ${activeOption === option.key ? 'active' : ''}`}
            onClick={() => setActiveOption(option.key)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;