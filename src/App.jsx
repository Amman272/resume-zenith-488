import React, { useState } from 'react';
import Navigation from './components/Navigation';
import CareerGuidance from './components/features/CareerGuidance';
import ResumeAnalysis from './components/features/ResumeAnalysis';
import LearningPath from './components/features/LearningPath';
import MockInterview from './components/features/MockInterview';
import JobMarketInsights from './components/features/JobMarketInsights';
import NetworkingSuggestions from './components/features/NetworkingSuggestions';

function App() {
  const [activeFeature, setActiveFeature] = useState('career-guidance');

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'career-guidance':
        return <CareerGuidance />;
      case 'resume-analysis':
        return <ResumeAnalysis />;
      case 'learning-path':
        return <LearningPath />;
      case 'mock-interview':
        return <MockInterview />;
      case 'job-market':
        return <JobMarketInsights />;
      case 'networking':
        return <NetworkingSuggestions />;
      default:
        return <CareerGuidance />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navigation 
        activeFeature={activeFeature} 
        setActiveFeature={setActiveFeature} 
      />
      <main className="container" style={{ padding: '2rem 0' }}>
        {renderActiveFeature()}
      </main>
    </div>
  );
}

export default App;