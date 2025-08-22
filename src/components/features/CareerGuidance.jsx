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
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            padding: '0.75rem', 
            borderRadius: '50%', 
            backgroundColor: '#dbeafe' 
          }}>
            <Lightbulb style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
          </div>
        </div>
        <h2 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          color: '#111827', 
          marginBottom: '1.5rem' 
        }}>AI Career Guidance Chatbot</h2>
        <p style={{ 
          color: '#6b7280', 
          lineHeight: '1.75', 
          fontSize: '1rem', 
          textAlign: 'center', 
          maxWidth: '42rem', 
          margin: '0 auto' 
        }}>
          Get personalized career advice based on your skills, interests, and goals. 
          Our AI will analyze your input and provide tailored recommendations for your career journey.
        </p>
      </div>

      {/* Input Section */}
      <div className="card">
        <div style={{
          borderBottom: '1px solid #f3f4f6',
          paddingBottom: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <User style={{ width: '1.25rem', height: '1.25rem' }} />
            Tell Us About Yourself
          </h3>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="career-input" style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.875rem'
          }}>
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
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>
            💡 Tip: Be specific about your background, interests, and what you're looking for in your career.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleGetGuidance}
            disabled={loading}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Target style={{ width: '1rem', height: '1rem' }} />
            {loading ? 'Generating Guidance...' : 'Get Career Guidance'}
          </button>
          
          {(userInput || guidance) && (
            <button
              onClick={handleClear}
              className="btn"
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                border: '1px solid #93c5fd'
              }}
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
        <div className="card">
          <div className="card-header">
            <h3 className="heading-tertiary text-green-600">
              🎯 Your Personalized Career Guidance
            </h3>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <div className="prose max-w-none text-sm">
              {convertMarkup(guidance)}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2 text-sm">💡 Next Steps:</h4>
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
      <div className="info-box">
        <h3 className="heading-tertiary">How to Get Better Results</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2 text-sm">Include Information About:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your current role and experience level</li>
              <li>• Technical and soft skills you possess</li>
              <li>• Industries that interest you</li>
              <li>• Your career goals and timeline</li>
              <li>• Preferred work environment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2 text-sm">Example Topics to Mention:</h4>
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