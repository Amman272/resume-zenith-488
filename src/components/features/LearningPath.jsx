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

const LearningPath = () => {
  // Component state management
  const [skills, setSkills] = useState('');
  const [learningPath, setLearningPath] = useState('');
  const [youtubeChannels, setYoutubeChannels] = useState([]);
  const [loadingPath, setLoadingPath] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [error, setError] = useState('');

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
            <div key={index} className="youtube-channel">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
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
                  <p className="youtube-channel p">
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

        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
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
          <div className="bg-primary-100 p-4 rounded-full">
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="heading-secondary">Personalized Learning Path</h2>
        <p className="text-body text-center max-w-2xl mx-auto">
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
          
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <div className="prose max-w-none">
              {learningPath.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Format different types of content
                if (paragraph.match(/^\d+\.|^[•\-\*]|^#{1,3}/)) {
                  return (
                    <div key={index} className="mb-4">
                      <h4 className="font-bold text-green-800">{paragraph.replace(/[#*]/g, '')}</h4>
                    </div>
                  );
                }
                
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

          {/* Learning Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
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
      <div className="card bg-gray-50">
        <h3 className="heading-tertiary">Learning Resource Types</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📚 Structured Courses</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Coursera, edX, Udacity</li>
              <li>• LinkedIn Learning</li>
              <li>• Pluralsight, Udemy</li>
              <li>• University online programs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎥 Video Learning</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• YouTube tutorials</li>
              <li>• Khan Academy</li>
              <li>• freeCodeCamp</li>
              <li>• Tech conference talks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🛠️ Hands-on Practice</h4>
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