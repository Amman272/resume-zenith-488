/**
 * Networking Suggestions Component
 * Provides AI-powered professional networking advice and strategies
 * Tailored recommendations based on industry, career stage, and goals
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getNetworkingSuggestions } from '../../backend/services/aiService';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';
import { Users, Target, Briefcase, MessageCircle, Linkedin } from 'lucide-react';

const NetworkingSuggestions = () => {
  // Component state management
  const [formData, setFormData] = useState({
    industry: '',
    careerStage: 'Mid-Career',
    networkingGoal: 'General'
  });
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function convertMarkup(suggestions){
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
          {suggestions}
        </ReactMarkdown>
      </div>
    );
  }

  /**
   * Handles form input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handles networking suggestions generation
   */
  const handleGetSuggestions = async () => {
    if (!formData.industry.trim()) {
      setError('Please enter your industry or field of interest.');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions('');

    try {
      const result = await getNetworkingSuggestions(
        formData.industry,
        formData.careerStage,
        formData.networkingGoal
      );
      setSuggestions(result);
    } catch (err) {
      setError(err.message || 'Failed to generate networking suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clears all form data and results
   */
  const handleClear = () => {
    setFormData({
      industry: '',
      careerStage: 'Mid-Career',
      networkingGoal: 'General'
    });
    setSuggestions('');
    setError('');
  };

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="feature-icon bg-blue-100">
            <Users className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="heading-secondary">Professional Networking Suggestions</h2>
        <p className="text-body text-center max-w-2xl mx-auto">
          Get personalized networking strategies, find relevant professional communities, 
          and learn how to build meaningful connections in your industry.
        </p>
      </div>

      {/* Input Form */}
      <div className="card">
        <div className="card-header">
          <h3 className="heading-tertiary flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Networking Profile
          </h3>
        </div>

        <div className="space-y-6">
          {/* Industry Input */}
          <div className="form-group">
            <label htmlFor="industry-input" className="form-label flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Industry or Field of Interest:
            </label>
            <input
              id="industry-input"
              type="text"
              className="form-input"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="e.g., Software Development, Digital Marketing, Data Science, Finance, Healthcare..."
            />
            <p className="text-sm text-gray-600 mt-2">
              Be specific about your industry for more targeted networking advice.
            </p>
          </div>

          {/* Career Stage and Goal Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="career-stage" className="form-label">
                Career Stage:
              </label>
              <select
                id="career-stage"
                className="form-select"
                value={formData.careerStage}
                onChange={(e) => handleInputChange('careerStage', e.target.value)}
              >
                <option value="Entry Level">Entry Level (0-2 years)</option>
                <option value="Mid-Career">Mid-Career (3-7 years)</option>
                <option value="Senior Professional">Senior Professional (8-15 years)</option>
                <option value="Executive">Executive (15+ years)</option>
                <option value="Career Changer">Career Changer</option>
                <option value="Student">Student/Recent Graduate</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="networking-goal" className="form-label">
                Primary Networking Goal:
              </label>
              <select
                id="networking-goal"
                className="form-select"
                value={formData.networkingGoal}
                onChange={(e) => handleInputChange('networkingGoal', e.target.value)}
              >
                <option value="General">General Networking</option>
                <option value="Job Search">Job Search</option>
                <option value="Career Advancement">Career Advancement</option>
                <option value="Industry Insights">Industry Insights</option>
                <option value="Mentorship">Finding Mentorship</option>
                <option value="Business Development">Business Development</option>
                <option value="Knowledge Sharing">Knowledge Sharing</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleGetSuggestions}
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {loading ? 'Generating Suggestions...' : 'Get Networking Suggestions'}
            </button>
            
            {(formData.industry || suggestions) && (
              <button
                onClick={handleClear}
                className="btn btn-outline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card">
          <LoadingSpinner message="Creating personalized networking strategies for your industry and goals..." />
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
      {suggestions && (
        <div className="card animate-slide-up">
          <div className="card-header">
            <h3 className="heading-tertiary text-green-700">
              Your Personalized Networking Strategy
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Tailored for: <strong>{formData.industry}</strong> • 
              <strong> {formData.careerStage}</strong> • 
              <strong> {formData.networkingGoal}</strong>
            </p>
          </div>
          
          <div style={{
            backgroundColor: "#f0fdf4",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #bbf7d0"
          }}>
            {convertMarkup(suggestions)}
          </div>

          {/* Action Items */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-2">Immediate Action Items:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Update your LinkedIn profile with current role and achievements</li>
              <li>• Identify 5-10 professionals in your target network</li>
              <li>• Join 2-3 relevant professional groups or communities</li>
              <li>• Prepare your elevator pitch and networking introduction</li>
              <li>• Set a goal to make 2-3 new connections per week</li>
            </ul>
          </div>
        </div>
      )}

      {/* Networking Tips and Best Practices */}
      <div className="info-box">
        <h3 className="heading-tertiary">Networking Best Practices</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-600" />
              LinkedIn Optimization:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Professional headshot photo</li>
              <li>• Compelling headline and summary</li>
              <li>• Regular content sharing and engagement</li>
              <li>• Personalized connection requests</li>
              <li>• Active participation in groups</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              Conversation Starters:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "What trends are you seeing in [industry]?"</li>
              <li>• "How did you get started in your field?"</li>
              <li>• "What's the most exciting project you're working on?"</li>
              <li>• "What advice would you give someone in my position?"</li>
              <li>• "What resources do you recommend for learning [skill]?"</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Follow-up Strategies:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Send personalized thank-you messages</li>
              <li>• Share relevant articles or resources</li>
              <li>• Offer help or introductions when possible</li>
              <li>• Schedule regular check-ins</li>
              <li>• Remember personal details from conversations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Virtual Networking Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
        <h3 className="heading-tertiary text-blue-800">💻 Virtual Networking in the Digital Age</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Online Platforms:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• LinkedIn - Professional networking</li>
              <li>• Twitter - Industry conversations and thought leadership</li>
              <li>• Discord/Slack - Community-based networking</li>
              <li>• Clubhouse - Audio-based networking events</li>
              <li>• Industry-specific forums and communities</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Virtual Event Tips:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Participate actively in chat and Q&A</li>
              <li>• Follow up with speakers and attendees</li>
              <li>• Join breakout rooms and smaller sessions</li>
              <li>• Share key takeaways on social media</li>
              <li>• Connect with other attendees on LinkedIn</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Networking Goals Tracker */}
      <div className="warning-box">
        <h3 className="heading-tertiary text-yellow-800">📊 Track Your Networking Progress</h3>
        <p className="text-yellow-700 mb-4">
          Set measurable networking goals to build your professional network systematically:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Weekly Goals:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Connect with 3-5 new professionals</li>
              <li>• Engage with 10+ LinkedIn posts</li>
              <li>• Share 1-2 valuable industry articles</li>
              <li>• Attend 1 virtual networking event</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Monthly Goals:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Have 5+ meaningful conversations</li>
              <li>• Join 1 new professional group</li>
              <li>• Offer help to 3+ connections</li>
              <li>• Update your professional profiles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkingSuggestions;