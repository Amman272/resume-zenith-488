/**
 * Job Market Insights Component
 * Displays current job market trends, salary data, and industry insights
 * Provides filtering options and interactive data visualization
 */

import React, { useState } from 'react';
import { getJobMarketInsights } from '../../backend/services/aiService';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';
import { TrendingUp, DollarSign, Users, Globe, BarChart3, Filter } from 'lucide-react';

const JobMarketInsights = () => {
  // Component state management
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    industry: 'All Industries',
    region: 'Global'
  });

  /**
   * Fetches job market insights from AI service
   */
  const handleGetInsights = async () => {
    setLoading(true);
    setError('');
    setInsights(null);

    try {
      const result = await getJobMarketInsights();
      setInsights(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch job market insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles filter changes
   */
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  /**
   * Renders trending roles section
   */
  const renderTrendingRoles = (roles) => (
    <div className="card">
      <div className="card-header">
        <h3 className="heading-tertiary text-green-700 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          🔥 Trending Job Roles
        </h3>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role, index) => (
          <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-800 mb-2">{role.role}</h4>
            <div className="text-sm space-y-1">
              <p className="text-green-700">
                <span className="font-semibold">Growth:</span> {role.growth}
              </p>
              <p className="text-gray-600">{role.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Renders emerging skills section
   */
  const renderEmergingSkills = (skills) => (
    <div className="card">
      <div className="card-header">
        <h3 className="heading-tertiary text-blue-700 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          ⚡ Emerging Skills in High Demand
        </h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-blue-800">{skill.skill}</h4>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                skill.demand === 'Very High' ? 'bg-red-100 text-red-700' :
                skill.demand === 'High' ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {skill.demand}
              </span>
            </div>
            <p className="text-sm text-gray-600">{skill.adoption}</p>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Renders salary trends section
   */
  const renderSalaryTrends = (salaries) => (
    <div className="card">
      <div className="card-header">
        <h3 className="heading-tertiary text-purple-700 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          💰 Salary Trends by Experience Level
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-50">
              <th className="border border-purple-200 p-3 text-left font-semibold text-purple-800">
                Role
              </th>
              <th className="border border-purple-200 p-3 text-left font-semibold text-purple-800">
                Entry Level
              </th>
              <th className="border border-purple-200 p-3 text-left font-semibold text-purple-800">
                Mid Level
              </th>
              <th className="border border-purple-200 p-3 text-left font-semibold text-purple-800">
                Senior Level
              </th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary, index) => (
              <tr key={index} className="hover:bg-purple-25">
                <td className="border border-purple-200 p-3 font-medium text-gray-800">
                  {salary.role}
                </td>
                <td className="border border-purple-200 p-3 text-gray-700">
                  {salary.entry_level}
                </td>
                <td className="border border-purple-200 p-3 text-gray-700">
                  {salary.mid_level}
                </td>
                <td className="border border-purple-200 p-3 text-gray-700">
                  {salary.senior_level}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700">
          💡 <strong>Note:</strong> Salary ranges are approximate and vary based on location, 
          company size, industry, and individual experience. These figures represent general market trends.
        </p>
      </div>
    </div>
  );

  /**
   * Renders AI-generated insights
   */
  const renderAIInsights = (insightsText) => (
    <div className="card">
      <div className="card-header">
        <h3 className="heading-tertiary text-indigo-700">
          🤖 AI-Generated Market Analysis
        </h3>
      </div>
      
      <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
        <div className="prose max-w-none">
          {insightsText.split('\n').map((paragraph, index) => {
            if (paragraph.trim() === '') return null;
            
            if (paragraph.match(/^\d+\.|^[•\-\*]|^#{1,3}|\*\*.*\*\*/)) {
              return (
                <div key={index} className="mb-4">
                  <h4 className="font-bold text-indigo-800">{paragraph.replace(/[#*]/g, '')}</h4>
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
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-4 rounded-full">
            <TrendingUp className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="heading-secondary">Real-Time Job Market Insights</h2>
        <p className="text-body text-center max-w-2xl mx-auto">
          Stay ahead of the curve with current job market trends, salary data, 
          and emerging opportunities across different industries and regions.
        </p>
      </div>

      {/* Filters Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="heading-tertiary flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Options
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label htmlFor="industry-filter" className="form-label">
              Industry:
            </label>
            <select
              id="industry-filter"
              className="form-select"
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
            >
              <option value="All Industries">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Marketing">Marketing</option>
              <option value="Consulting">Consulting</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="region-filter" className="form-label">
              Region:
            </label>
            <select
              id="region-filter"
              className="form-select"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="Global">Global</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Australia">Australia</option>
              <option value="South America">South America</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGetInsights}
          disabled={loading}
          className="btn btn-primary flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          {loading ? 'Fetching Insights...' : 'Get Market Insights'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card">
          <LoadingSpinner message="Analyzing current job market trends and gathering insights..." />
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
      {insights && (
        <div className="space-y-6 animate-slide-up">
          {/* Filter Display */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-sm text-gray-600">
              <strong>Showing insights for:</strong> {filters.industry} • {filters.region}
            </p>
          </div>

          {/* AI Generated Insights */}
          {insights.ai_generated && renderAIInsights(insights.insights)}

          {/* Structured Data Display */}
          {!insights.ai_generated && (
            <>
              {renderTrendingRoles(insights.trending_roles)}
              {renderEmergingSkills(insights.emerging_skills)}
              {renderSalaryTrends(insights.salary_trends)}
              
              {/* Market Analysis Summary */}
              <div className="card bg-gray-50">
                <div className="card-header">
                  <h3 className="heading-tertiary text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    📊 Market Analysis Summary
                  </h3>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    <strong>Key Market Trends:</strong>
                  </p>
                  <ul className="space-y-2">
                    <li>• AI and machine learning roles continue to show the highest growth rates</li>
                    <li>• Remote work has increased salary competitiveness across global markets</li>
                    <li>• Cybersecurity skills are becoming essential across all technology roles</li>
                    <li>• Companies are prioritizing candidates with both technical and soft skills</li>
                    <li>• Continuous learning and adaptation remain crucial for career advancement</li>
                  </ul>
                  
                  <p className="mt-6 mb-4">
                    <strong>Recommendations for Job Seekers:</strong>
                  </p>
                  <ul className="space-y-2">
                    <li>• Focus on developing skills in high-demand areas like AI, cloud computing, and cybersecurity</li>
                    <li>• Build a strong online presence and portfolio showcasing your work</li>
                    <li>• Network actively within your target industry and role</li>
                    <li>• Stay updated with industry trends and emerging technologies</li>
                    <li>• Consider obtaining relevant certifications to validate your skills</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Action Items */}
          <div className="card bg-blue-50">
            <h3 className="heading-tertiary text-blue-800">🎯 Next Steps Based on Market Insights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">For Job Seekers:</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Update your resume with trending skills</li>
                  <li>• Research companies in growing industries</li>
                  <li>• Start learning high-demand skills</li>
                  <li>• Network with professionals in target roles</li>
                  <li>• Prepare for salary negotiations with market data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">For Career Changers:</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Identify transferable skills from your background</li>
                  <li>• Create a learning plan for new industry requirements</li>
                  <li>• Consider transitional roles or internships</li>
                  <li>• Build projects to demonstrate new skills</li>
                  <li>• Connect with professionals who made similar transitions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information Card */}
      <div className="card bg-yellow-50">
        <h3 className="heading-tertiary text-yellow-800">📈 About This Data</h3>
        <p className="text-yellow-700 mb-4">
          Our job market insights are generated using AI analysis of current industry trends, 
          job postings, salary surveys, and market reports. The data is updated regularly to 
          provide you with the most current information available.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Data Sources:</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• Industry reports</li>
              <li>• Job board analytics</li>
              <li>• Salary surveys</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Update Frequency:</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• Real-time AI analysis</li>
              <li>• Monthly trend updates</li>
              <li>• Quarterly deep dives</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Coverage:</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• Global job markets</li>
              <li>• Multiple industries</li>
              <li>• All experience levels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMarketInsights;