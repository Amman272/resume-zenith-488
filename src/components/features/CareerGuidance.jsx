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
  return (
    <div style={{ 
      fontFamily: "'Inter', sans-serif",
      lineHeight: "1.7",
      color: "#2d3748"
    }}>
      <ReactMarkdown
        components={{
          // Main headings - Large feature boxes
          h1: ({ node, ...props }) => (
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "16px",
                padding: "24px 32px",
                margin: "32px 0 24px 0",
                color: "white",
                fontSize: "2rem",
                fontWeight: "700",
                textAlign: "center",
                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <span {...props} />
            </div>
          ),
          
          // Section headings - Prominent blue boxes
          h2: ({ node, ...props }) => (
            <div
              style={{
                background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
                borderRadius: "12px",
                padding: "20px 24px",
                margin: "28px 0 20px 0",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "600",
                boxShadow: "0 8px 20px rgba(66, 153, 225, 0.25)",
                border: "1px solid rgba(255,255,255,0.15)",
                position: "relative"
              }}
            >
              <div style={{
                position: "absolute",
                top: "-2px",
                left: "-2px",
                right: "-2px",
                bottom: "-2px",
                background: "linear-gradient(135deg, #4299e1, #3182ce)",
                borderRadius: "12px",
                zIndex: -1,
                opacity: 0.1
              }} />
              <span {...props} />
            </div>
          ),
          
          // Subsection headings - Elegant left-border style
          h3: ({ node, ...props }) => (
            <div
              style={{
                borderLeft: "6px solid #4299e1",
                backgroundColor: "#f7fafc",
                padding: "16px 20px",
                margin: "24px 0 16px 0",
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#2d3748",
                borderRadius: "0 8px 8px 0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #e2e8f0",
                borderLeft: "6px solid #4299e1"
              }}
            >
              <span {...props} />
            </div>
          ),
          
          // Smaller headings - Clean minimal style
          h4: ({ node, ...props }) => (
            <div
              style={{
                backgroundColor: "#edf2f7",
                padding: "12px 16px",
                margin: "20px 0 12px 0",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#4a5568",
                borderRadius: "6px",
                border: "1px solid #cbd5e0"
              }}
            >
              <span {...props} />
            </div>
          ),
          
          // Bold text - Highlighted badges
          strong: ({ node, ...props }) => (
            <span
              style={{
                backgroundColor: "#bee3f8",
                color: "#2b6cb0",
                fontWeight: "600",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "0.95em",
                border: "1px solid #90cdf4"
              }}
              {...props}
            />
          ),
          
          // Paragraphs - Better spacing and readability
          p: ({ node, ...props }) => (
            <p
              style={{
                margin: "16px 0",
                fontSize: "1rem",
                lineHeight: "1.7",
                color: "#4a5568"
              }}
              {...props}
            />
          ),
          
          // Lists - Enhanced styling
          ul: ({ node, ...props }) => (
            <ul
              style={{
                margin: "16px 0",
                paddingLeft: "24px",
                listStyleType: "none"
              }}
              {...props}
            />
          ),
          
          li: ({ node, ...props }) => (
            <li
              style={{
                margin: "8px 0",
                padding: "8px 12px",
                backgroundColor: "#f8fafc",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                position: "relative",
                paddingLeft: "32px"
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#4299e1",
                  borderRadius: "50%"
                }}
              />
              <span {...props} />
            </li>
          ),
          
          // Code blocks - Professional styling
          code: ({ node, inline, ...props }) => (
            inline ? (
              <code
                style={{
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.9em",
                  fontFamily: "'Fira Code', monospace",
                  border: "1px solid #cbd5e0"
                }}
                {...props}
              />
            ) : (
              <pre
                style={{
                  backgroundColor: "#1a202c",
                  color: "#e2e8f0",
                  padding: "20px",
                  borderRadius: "8px",
                  margin: "20px 0",
                  overflow: "auto",
                  fontSize: "0.9em",
                  fontFamily: "'Fira Code', monospace",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                }}
              >
                <code {...props} />
              </pre>
            )
          ),
          
          // Blockquotes - Inspirational styling
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                borderLeft: "4px solid #38b2ac",
                backgroundColor: "#f0fff4",
                padding: "16px 20px",
                margin: "20px 0",
                fontStyle: "italic",
                color: "#2d3748",
                borderRadius: "0 8px 8px 0",
                boxShadow: "0 2px 8px rgba(56, 178, 172, 0.1)"
              }}
              {...props}
            />
          )
        }}
      >
        {guidance}
      </ReactMarkdown>
    </div>
  );
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