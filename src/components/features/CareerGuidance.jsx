/**
 * Career Guidance Component
 * Provides AI-powered career counseling based on user input
 * Analyzes skills, interests, and goals to suggest career paths
 */

import React, { useState } from 'react';
import { getCareerGuidance } from '../../backend/services/aiService';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';
import { User, Target, Lightbulb } from 'lucide-react';
import ReactMarkdown from "react-markdown";

const CareerGuidance = () => {
  // Component state management
  const [userInput, setUserInput] = useState('');
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
function convertMarkup(guidance){
  const text = guidance;
  return     <ReactMarkdown
      components={{
        h2: ({ node, ...props }) => (
          <div
            style={{
              border: "2px solid #1976d2",
              borderRadius: "8px",
              padding: "12px 16px",
              margin: "16px 0",
              backgroundColor: "#e3f2fd",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1976d2",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <span {...props} />
          </div>
        ),
        h3: ({ node, ...props }) => (
          <div
            style={{
              borderLeft: "4px solid #1976d2",
              padding: "8px 12px",
              margin: "12px 0",
              backgroundColor: "#f5faff",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#0d47a1",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "4px"
            }}
          >
            <span {...props} />
          </div>
        ),
        strong: ({ node, ...props }) => (
          <span
            style={{
              backgroundColor: "#bbdefb",
              color: "#0d47a1",
              fontWeight: "bold",
              padding: "2px 6px",
              borderRadius: "4px"
            }}
            {...props}
          />
        ),
      }}
    >
      {guidance}
    </ReactMarkdown>
}


  /**
   * Handles the career guidance request
   * Validates input and calls AI service to generate guidance
   */
  const handleGetGuidance = async () => {
    // Input validation
    if (!userInput.trim()) {
      setError('Please provide some information about your skills and interests.');
      return;
    }

    setLoading(true);
    setError('');
    setGuidance('');

    try {
      // Call AI service to generate career guidance
      const result = await getCareerGuidance(userInput);
      setGuidance(result);
     // convertMarkup(guidance);
      console.log(result)
    } catch (err) {
      setError(err.message || 'Failed to generate career guidance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clears all form data and results
   */
  const handleClear = () => {
    setUserInput('');
    setGuidance('');
    setError('');
  };

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-4 rounded-full">
            <Lightbulb className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="heading-secondary">AI Career Guidance Chatbot</h2>
        <p className="text-body text-center max-w-2xl mx-auto">
          Get personalized career advice based on your skills, interests, and goals. 
          Our AI will analyze your input and provide tailored recommendations for your career journey.
        </p>
      </div>

      {/* Input Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="heading-tertiary flex items-center gap-2">
            <User className="w-5 h-5" />
            Tell Us About Yourself
          </h3>
        </div>

        <div className="form-group">
          <label htmlFor="career-input" className="form-label">
            Describe your skills, interests, experience, and career goals:
          </label>
          <textarea
            id="career-input"
            className="form-textarea"
            rows="6"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Example: I have 3 years of experience in marketing, I'm interested in digital marketing and data analysis, I enjoy creative problem-solving, and I want to transition into a more technical role that combines marketing with data science..."
          />
          <p className="text-sm text-gray-600 mt-2">
            💡 Tip: Be specific about your background, interests, and what you're looking for in your career.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleGetGuidance}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            {loading ? 'Generating Guidance...' : 'Get Career Guidance'}
          </button>
          
          {(userInput || guidance) && (
            <button
              onClick={handleClear}
              className="btn btn-outline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card">
          <LoadingSpinner message="Analyzing your profile and generating personalized career guidance..." />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onDismiss={() => setError('')} 
        />
      )}

      {/* Results Section */}
      {guidance && (
        <div className="card animate-slide-up">
          <div className="card-header">
            <h3 className="heading-tertiary text-green-700">
              🎯 Your Personalized Career Guidance
            </h3>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <div className="prose max-w-none">
              {/* Format the guidance text with proper line breaks and structure
              {guidance.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Check if it's a heading (starts with numbers or bullets)
                if (paragraph.match(/^\d+\.|^[•\-\*]/)) {
                  return (
                    <div key={index} className="mb-3">
                      <p className="font-semibold text-gray-800">{paragraph}</p>
                    </div>
                  );
                }
                
                return (
                  <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })} */}
            {convertMarkup(guidance)}
              <div className="prose max-w-none">
  {/* <ReactMarkdown>{guidance}</ReactMarkdown> */}
</div>

            </div>
          </div>

          {/* Additional Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Next Steps:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Save this guidance for future reference</li>
              <li>• Research the suggested career paths and companies</li>
              <li>• Start developing the recommended skills</li>
              <li>• Network with professionals in your target industries</li>
              <li>• Consider updating your resume based on this guidance</li>
            </ul>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="card bg-gray-50">
        <h3 className="heading-tertiary">How to Get Better Results</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Include Information About:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your current role and experience level</li>
              <li>• Technical and soft skills you possess</li>
              <li>• Industries that interest you</li>
              <li>• Your career goals and timeline</li>
              <li>• Preferred work environment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Example Topics to Mention:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Programming languages you know</li>
              <li>• Leadership or project management experience</li>
              <li>• Education and certifications</li>
              <li>• Salary expectations or location preferences</li>
              <li>• Work-life balance priorities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;