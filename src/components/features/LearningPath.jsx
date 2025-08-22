/**
 * Learning Path Component
 * Generates personalized learning recommendations and finds YouTube channels
 * Helps users create structured learning plans for skill development
 */

import React, { useState } from 'react';
import { getLearningPath, getBestYouTubeChannels } from '../../backend/services/aiService';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';
import { BookOpen, Youtube, ExternalLink, Play } from 'lucide-react';
import ReactMarkdown from "react-markdown";

const LearningPath = () => {
  // Component state management
  const [skills, setSkills] = useState('');
  const [learningPath, setLearningPath] = useState('');
  const [youtubeChannels, setYoutubeChannels] = useState([]);
  const [loadingPath, setLoadingPath] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [error, setError] = useState('');

  function convertMarkup(learningPath){
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
          {learningPath}
        </ReactMarkdown>
      </div>
    );
  }

  /**
   * Handles learning path generation
   * Validates input and calls AI service to create personalized learning plan
   */
  const handleGetLearningPath = async () => {
    if (!skills.trim()) {
      setError('Please enter the skills you want to learn.');
      return;
    }

    setLoadingPath(true);
    setError('');
    setLearningPath('');

    try {
      const result = await getLearningPath(skills);
      setLearningPath(result);
    } catch (err) {
      setError(err.message || 'Failed to generate learning path. Please try again.');
    } finally {
      setLoadingPath(false);
    }
  };

  /**
   * Handles YouTube channel recommendations
   * Finds relevant educational channels for the specified skills
   */
  const handleGetYouTubeChannels = async () => {
    if (!skills.trim()) {
      setError('Please enter the skills you want to learn.');
      return;
    }

    setLoadingChannels(true);
    setError('');
    setYoutubeChannels([]);

    try {
      const channels = await getBestYouTubeChannels(skills);
      setYoutubeChannels(Array.isArray(channels) ? channels : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch YouTube channels. Please try again.');
    } finally {
      setLoadingChannels(false);
    }
  };

  /**
   * Clears all form data and results
   */
  const handleClear = () => {
    setSkills('');
    setLearningPath('');
    setYoutubeChannels([]);
    setError('');
  };

  /**
   * Renders YouTube channel cards with proper formatting
   */
  const renderYouTubeChannels = () => {
    if (youtubeChannels.length === 0) return null;

    return (
      <div className="card animate-slide-up">
        <div className="card-header">
          <h3 className="heading-tertiary text-red-600 flex items-center gap-2">
            <Youtube className="w-5 h-5" />
            Recommended YouTube Channels for {skills}
          </h3>
        </div>

        <div className="space-y-4">
          {youtubeChannels.map((channel, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 p-6 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                  <Play className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <a
                      href={channel.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="youtube-channel a flex items-center gap-1"
                    >
                      {channel.name || `Channel ${index + 1}`}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm mt-3">
                    {channel.description || 'Educational content related to your learning goals.'}
                  </p>
                  {channel.contentType && (
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {channel.contentType}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-semibold text-red-800 mb-2">📺 YouTube Learning Tips:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Subscribe to channels that match your learning style</li>
            <li>• Create playlists to organize your learning content</li>
            <li>• Take notes while watching tutorials</li>
            <li>• Practice along with coding/tutorial videos</li>
            <li>• Join channel communities for additional support</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="feature-icon bg-blue-100">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h2 className="heading-secondary">Personalized Learning Path</h2>
        <p className="text-body text-center max-w-2xl mx-auto mb-0">
          Get a customized learning roadmap with courses, resources, and YouTube channels 
          tailored to help you master the skills you want to develop.
        </p>
      </div>

      {/* Input Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="heading-tertiary flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Skills You Want to Learn
          </h3>
        </div>

        <div className="form-group">
          <label htmlFor="skills-input" className="form-label">
            Enter skills (separate multiple skills with commas):
          </label>
          <textarea
            id="skills-input"
            className="form-textarea"
            rows="3"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Example: React, Node.js, Python, Machine Learning, Data Analysis, Digital Marketing, UI/UX Design..."
          />
          <p className="text-sm text-gray-600 mt-2">
            💡 Tip: Be specific about the skills and technologies you want to learn for better recommendations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleGetLearningPath}
            disabled={loadingPath}
            className="btn btn-primary flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {loadingPath ? 'Creating Learning Path...' : 'Get Learning Path'}
          </button>
          
          <button
            onClick={handleGetYouTubeChannels}
            disabled={loadingChannels}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Youtube className="w-4 h-4" />
            {loadingChannels ? 'Finding Channels...' : 'Get Free YouTube Resources'}
          </button>

          {(skills || learningPath || youtubeChannels.length > 0) && (
            <button
              onClick={handleClear}
              className="btn btn-outline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Loading States */}
      {loadingPath && (
        <div className="card">
          <LoadingSpinner message="Creating your personalized learning path..." />
        </div>
      )}

      {loadingChannels && (
        <div className="card">
          <LoadingSpinner message="Finding the best YouTube channels for your skills..." />
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

      {/* Learning Path Results */}
      {learningPath && (
        <div className="card animate-slide-up">
          <div className="card-header">
            <h3 className="heading-tertiary text-green-700">
              🎯 Your Personalized Learning Path
            </h3>
          </div>
          
          <div style={{
            backgroundColor: "#f0fdf4",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #bbf7d0"
          }}>
            {convertMarkup(learningPath)}
          </div>

          {/* Learning Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-2">📚 Learning Success Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Set specific, measurable learning goals</li>
              <li>• Practice consistently, even if just 30 minutes daily</li>
              <li>• Build projects to apply what you learn</li>
              <li>• Join communities and forums for support</li>
              <li>• Track your progress and celebrate milestones</li>
            </ul>
          </div>
        </div>
      )}

      {/* YouTube Channels Results */}
      {renderYouTubeChannels()}

      {/* Learning Resources Guide */}
      <div className="info-box">
        <h3 className="heading-tertiary">Learning Resource Types</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2 text-sm">📚 Structured Courses</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Coursera, edX, Udacity</li>
              <li>• LinkedIn Learning</li>
              <li>• Pluralsight, Udemy</li>
              <li>• University online programs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2 text-sm">🎥 Video Learning</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• YouTube tutorials</li>
              <li>• Khan Academy</li>
              <li>• freeCodeCamp</li>
              <li>• Tech conference talks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2 text-sm">🛠️ Hands-on Practice</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• GitHub projects</li>
              <li>• Coding challenges</li>
              <li>• Kaggle competitions</li>
              <li>• Personal projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;