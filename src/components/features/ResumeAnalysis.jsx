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
import ReactMarkdown from "react-markdown";

const ResumeAnalysis = () => {
  // Component state management
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extracting, setExtracting] = useState(false);

  function convertMarkup(analysis){
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
          {analysis}
        </ReactMarkdown>
      </div>
    );
  }

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
          
          <div style={{
            backgroundColor: "#f0fdf4",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #bbf7d0"
          }}>
            {convertMarkup(analysis)}
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