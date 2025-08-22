/**
 * Job Market Insights Component
 * Displays current job market trends, salary data, and industry insights
 * Provides filtering options and interactive data visualization
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
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

  function convertMarkup(insights){
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
          {insights}
        </ReactMarkdown>
      </div>
    );
  }

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
        <table className="data-table">
          <thead>
            <tr>
              <th>
                Role
              </th>
              <th>
                Entry Level
              </th>
              <th>
                Mid Level
              </th>
              <th>
                Senior Level
              </th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary, index) => (
              <tr key={index}>
                <td className="font-medium text-gray-800">
                  {salary.role}
                </td>
                <td>
                  {salary.entry_level}
                </td>
                <td>
                  {salary.mid_level}
                </td>
                <td>
                  {salary.senior_level}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
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
      
      <div style={{
        backgroundColor: "#eef2ff",
        padding: "1.5rem",
        borderRadius: "8px",
        border: "1px solid #c7d2fe"
      }}>
        {convertMarkup(insightsText)}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="feature-icon bg-blue-100">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h2 className="heading-secondary">Real-Time Job Market Insights</h2>
        <p className="text-body text-center max-w-2xl mx-auto mb-0">
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
              <span className="font-medium">Showing insights for:</span> {filters.industry} • {filters.region}
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
              <div className="info-box">
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
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
      <div className="warning-box">
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