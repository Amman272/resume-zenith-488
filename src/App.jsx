/**
 * Main App Component
 * Root component that manages the overall application state and navigation
 * Renders different feature components based on user selection
 */

import React, { useState } from 'react';
import Navigation from './components/Navigation';
import CareerGuidance from './components/features/CareerGuidance';
import ResumeAnalysis from './components/features/ResumeAnalysis';
import LearningPath from './components/features/LearningPath';
import MockInterview from './components/features/MockInterview';
import JobMarketInsights from './components/features/JobMarketInsights';
import NetworkingSuggestions from './components/features/NetworkingSuggestions';
import { Brain, Sparkles } from 'lucide-react';

function App() {
  // Main application state - tracks which feature is currently active
  const [activeOption, setActiveOption] = useState('career');

  /**
   * Renders the appropriate feature component based on active selection
   * @returns {JSX.Element} The selected feature component
   */
  const renderActiveComponent = () => {
    switch (activeOption) {
      case 'career':
        return <CareerGuidance />;
      case 'resume':
        return <ResumeAnalysis />;
      case 'learning':
        return <LearningPath />;
      case 'interview':
        return <MockInterview />;
      case 'insights':
        return <JobMarketInsights />;
      case 'networking':
        return <NetworkingSuggestions />;
      default:
        return <CareerGuidance />;
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Main Application Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-3 rounded-full">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
          
          <h1 className="heading-primary">
            AI Career Counselor & Resume Analyzer
          </h1>
          
          <p className="text-body text-center max-w-3xl mx-auto">
            Your comprehensive AI-powered career guidance system. Get personalized advice, 
            analyze your resume, practice interviews, explore learning paths, and stay updated 
            with job market trends - all powered by advanced artificial intelligence.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              🎯 Career Guidance
            </span>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              📄 Resume Analysis
            </span>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              🎤 Mock Interviews
            </span>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              📚 Learning Paths
            </span>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              📊 Market Insights
            </span>
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              🤝 Networking Tips
            </span>
          </div>
        </header>

        {/* Navigation Component */}
        <Navigation 
          activeOption={activeOption} 
          setActiveOption={setActiveOption} 
        />

        {/* Main Content Area */}
        <main className="min-h-[60vh]">
          {renderActiveComponent()}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary-600" />
            <span className="text-gray-600 font-medium">
              Powered by AI • Built with React & Tailwind CSS
            </span>
          </div>
          
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            This AI Career Counselor uses advanced language models to provide personalized 
            career guidance. While our AI provides valuable insights, always consider multiple 
            sources and professional advice for important career decisions.
          </p>
          
          <div className="mt-4 flex justify-center gap-6 text-sm text-gray-400">
            <span>© 2024 AI Career Guide</span>
            <span>•</span>
            <span>Privacy-Focused</span>
            <span>•</span>
            <span>Continuously Learning</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;