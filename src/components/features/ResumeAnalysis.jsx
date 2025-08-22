/**
 * Resume Analysis Component
 * Allows users to upload PDF resumes and get AI-powered analysis and feedback
 * Provides detailed recommendations for resume improvement
 */

import React, { useState } from 'react';
import { analyzeResume } from '../../backend/services/aiService';
import { extractTextFromPDF, validatePDFFile, getFileInfo } from '../../backend/services/pdfService';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ResumeAnalysis = () => {
  // Component state management
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extracting, setExtracting] = useState(false);

  /**
   * Handles file selection and validation
   * @param {Event} event - File input change event
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      setFileInfo(null);
      return;
    }

    // Validate PDF file
    if (!validatePDFFile(file)) {
      setError('Please upload a valid PDF file (max 10MB).');
      setSelectedFile(null);
      setFileInfo(null);
      return;
    }

    setSelectedFile(file);
    setFileInfo(getFileInfo(file));
    setError('');
    setAnalysis(''); // Clear previous analysis
  };

  /**
   * Handles resume analysis process
   * Extracts text from PDF and sends to AI for analysis
   */
  const handleAnalyzeResume = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setExtracting(true);
    setError('');
    setAnalysis('');

    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(selectedFile);
      setExtracting(false);

      // Analyze resume with AI
      const result = await analyzeResume(resumeText);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
      setExtracting(false);
    }
  };

  /**
   * Clears all data and resets the component
   */
  const handleClear = () => {
    setSelectedFile(null);
    setFileInfo(null);
    setAnalysis('');
    setError('');
    // Reset file input
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="feature-icon bg-blue-100">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h2 className="heading-secondary">AI Resume Analyzer</h2>
        <p className="text-body text-center max-w-2xl mx-auto mb-0">
          Upload your resume and get detailed AI-powered feedback on structure, content, 
          and suggestions for improvement to make your resume stand out to employers.
        </p>
      </div>

      {/* File Upload Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="heading-tertiary flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Your Resume
          </h3>
        </div>

        {/* File Input */}
        <div className="form-group">
          <label htmlFor="resume-upload" className="form-label">
            Select PDF Resume (Max 10MB):
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <p className="text-sm text-gray-600 mt-2">
            📄 Only PDF files are supported. Make sure your resume is clearly formatted and readable.
          </p>
        </div>

        {/* File Information Display */}
        {fileInfo && (
          <div className="success-box mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">File Selected Successfully</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Name:</strong> {fileInfo.name}</p>
              <p><strong>Size:</strong> {fileInfo.size}</p>
              <p><strong>Type:</strong> {fileInfo.type}</p>
              <p><strong>Last Modified:</strong> {fileInfo.lastModified}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleAnalyzeResume}
            disabled={!selectedFile || loading}
            className="btn btn-primary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {loading ? (extracting ? 'Extracting Text...' : 'Analyzing Resume...') : 'Analyze Resume'}
          </button>
          
          {(selectedFile || analysis) && (
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
          <LoadingSpinner 
            message={extracting ? 
              "Extracting text from your PDF resume..." : 
              "Analyzing your resume and generating detailed feedback..."
            } 
          />
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

      {/* Analysis Results */}
      {analysis && (
        <div className="card">
          <div className="card-header">
            <h3 className="heading-tertiary text-blue-600">
              📊 Your Resume Analysis & Recommendations
            </h3>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="prose max-w-none text-sm">
              {/* Format the analysis text with proper structure */}
              {analysis.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                // Check for section headers (usually contain numbers or special formatting)
                if (paragraph.match(/^\d+\.|^[•\-\*]|^#{1,3}|^\*\*.*\*\*$/)) {
                  return (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold text-blue-800 text-base">{paragraph.replace(/[#*]/g, '')}</h4>
                    </div>
                  );
                }
                
                // Check for sub-points or bullet points
                if (paragraph.match(/^[\s]*[-•]/)) {
                  return (
                    <div key={index} className="mb-2 ml-4">
                      <p className="text-blue-700 text-sm">{paragraph}</p>
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
          <div className="mt-6 warning-box">
            <h4 className="font-medium text-yellow-800 mb-2 text-sm">🎯 Action Items:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Review and implement the suggested improvements</li>
              <li>• Update your resume based on the feedback provided</li>
              <li>• Consider tailoring your resume for specific job applications</li>
              <li>• Have someone else review your updated resume</li>
              <li>• Test your resume with ATS (Applicant Tracking Systems)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="info-box">
        <h3 className="heading-tertiary">Resume Analysis Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Best Practices:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use a clean, professional format</li>
              <li>• Include relevant keywords for your industry</li>
              <li>• Quantify achievements with numbers and metrics</li>
              <li>• Keep it concise (1-2 pages for most roles)</li>
              <li>• Use action verbs to describe experiences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              Common Issues to Avoid:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Spelling and grammar errors</li>
              <li>• Generic objective statements</li>
              <li>• Missing contact information</li>
              <li>• Inconsistent formatting</li>
              <li>• Too much personal information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;