/**
 * Networking Suggestions Component
 * Provides AI-powered professional networking advice and strategies
 * Tailored recommendations based on industry, career stage, and goals
 */

import React, { useState } from 'react';
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
              💡 Be specific about your industry for more targeted networking advice.
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
              🤝 Your Personalized Networking Strategy
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Tailored for: <strong>{formData.industry}</strong> • 
              <strong> {formData.careerStage}</strong> • 
              <strong> {formData.networkingGoal}</strong>
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <div className="prose max-w-none">
              {suggestions.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Format section headers
                if (paragraph.match(/^\d+\.|^[•\-\*]|^#{1,3}|\*\*.*\*\*/)) {
                  return (
                    <div key={index} className="mb-4">
                      <h4 className="font-bold text-green-800 text-lg">{paragraph.replace(/[#*]/g, '')}</h4>
                    </div>
                  );
                }
                
                // Format bullet points
                if (paragraph.match(/^[\s]*[-•]/)) {
                  return (
                    <div key={index} className="mb-2 ml-4">
                      <p className="text-green-700">{paragraph}</p>
                    </div>
                  );
                }
                
                return (
                  <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-2">🎯 Immediate Action Items:</h4>
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