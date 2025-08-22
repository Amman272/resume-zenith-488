/**
 * Navigation Component
 * Renders the main navigation menu for switching between different features
 * Uses a clean, responsive design with active state indicators
 */

import React from 'react';

const Navigation = ({ activeFeature, setActiveFeature }) => {
  // Available navigation options with their display names
  const options = [
    { key: "career-guidance", label: "Career Guidance" },
    { key: "resume-analysis", label: "Resume Analysis" },
    { key: "learning-path", label: "Learning Path" },
    { key: "mock-interview", label: "Mock Interview" },
    { key: "job-market", label: "Job Market Insights" },
    { key: "networking", label: "Networking" }
  ];

  return (
    <div style={{
      backgroundColor: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
      border: '1px solid #f3f4f6', 
      padding: '1.5rem', 
      marginBottom: '2rem' 
    }}>
      <h2 style={{
        fontSize: '1.25rem', 
        fontWeight: '600', 
        textAlign: 'center', 
        color: '#111827', 
        marginBottom: '1.5rem' 
      }}>
        Choose a Feature
      </h2>
      <ul style={{
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.75rem', 
        justifyContent: 'center',
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}>
        {options.map((option) => (
          <li
            key={option.key}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: '500',
              fontSize: '0.875rem',
              color: activeFeature === option.key ? 'white' : '#6b7280',
              backgroundColor: activeFeature === option.key ? '#2563eb' : 'transparent',
              border: `1px solid ${activeFeature === option.key ? '#2563eb' : 'transparent'}`,
              boxShadow: activeFeature === option.key ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeFeature !== option.key) {
                e.target.style.color = '#2563eb';
                e.target.style.backgroundColor = '#eff6ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFeature !== option.key) {
                e.target.style.color = '#6b7280';
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            onClick={() => setActiveFeature(option.key)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;