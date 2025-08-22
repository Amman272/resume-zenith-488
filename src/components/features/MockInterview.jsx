/**
 * Mock Interview Component
 * Provides AI-powered mock interview experience with questions, timing, and evaluation
 * Supports different interview styles and difficulty levels
 */

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateInterviewQuestions, evaluateInterview } from '../../backend/services/aiService';
import LoadingSpinner from '../LoadingSpinner';
import Alert from '../Alert';
import { 
  MessageSquare, 
  Clock, 
  Play, 
  SkipForward, 
  CheckCircle, 
  RotateCcw,
  Mic,
  Type,
  Star
} from 'lucide-react';

const MockInterview = () => {
  // Main state management
  const [currentPage, setCurrentPage] = useState('setup'); // setup, interview, evaluation
  const [jobRole, setJobRole] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [interviewStyle, setInterviewStyle] = useState('Mixed');
  const [difficulty, setDifficulty] = useState('Medium');
  
  // Interview state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  
  // Results state
  const [evaluation, setEvaluation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function convertMarkup(evaluation){
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
          {evaluation}
        </ReactMarkdown>
      </div>
    );
  }

  /**
   * Timer effect for question time limits
   */
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      // Auto-advance when time runs out
      handleNextQuestion();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);

  /**
   * Starts a new mock interview session
   */
  const startInterview = async () => {
    if (!jobRole.trim()) {
      setError('Please enter the job role you\'re preparing for.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const generatedQuestions = await generateInterviewQuestions(
        jobRole, 
        numQuestions, 
        interviewStyle, 
        difficulty
      );
      
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setResponses([]);
      setCurrentAnswer('');
      setTimeRemaining(60);
      setTimerActive(true);
      setCurrentPage('interview');
    } catch (err) {
      setError(err.message || 'Failed to generate interview questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles moving to the next question
   */
  const handleNextQuestion = () => {
    // Save current answer
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = currentAnswer || '(No response provided)';
    setResponses(updatedResponses);

    // Move to next question or finish interview
    if (currentQuestionIndex + 1 >= questions.length) {
      finishInterview(updatedResponses);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
      setTimeRemaining(60);
      setTimerActive(true);
    }
  };

  /**
   * Skips the current question
   */
  const handleSkipQuestion = () => {
    setCurrentAnswer('(Skipped)');
    handleNextQuestion();
  };

  /**
   * Finishes the interview and moves to evaluation
   */
  const finishInterview = async (finalResponses = responses) => {
    setTimerActive(false);
    setCurrentPage('evaluation');
    
    // Generate evaluation
    setLoading(true);
    try {
      const evaluationResult = await evaluateInterview(jobRole, questions, finalResponses);
      setEvaluation(evaluationResult);
    } catch (err) {
      setError('Failed to evaluate interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the interview to start over
   */
  const resetInterview = () => {
    setCurrentPage('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setCurrentAnswer('');
    setEvaluation('');
    setError('');
    setTimerActive(false);
  };

  /**
   * Formats time remaining for display
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Renders the interview setup page
   */
  const renderSetupPage = () => (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="feature-icon bg-blue-100">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h2 className="heading-secondary">AI-Powered Mock Interview</h2>
        <p className="text-body text-center max-w-2xl mx-auto mb-0">
          Practice your interview skills with AI-generated questions tailored to your target role. 
          Get detailed feedback and improve your interview performance.
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="heading-tertiary">Interview Configuration</h3>
        </div>

        <div className="space-y-6">
          {/* Job Role Input */}
          <div className="form-group">
            <label htmlFor="job-role" className="form-label">
              Job Role You're Preparing For:
            </label>
            <input
              id="job-role"
              type="text"
              className="form-input"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager, Data Scientist..."
            />
          </div>

          {/* Interview Settings Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="form-group">
              <label htmlFor="num-questions" className="form-label">
                Number of Questions:
              </label>
              <select
                id="num-questions"
                className="form-select"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              >
                {[3, 5, 7, 10].map(num => (
                  <option key={num} value={num}>{num} questions</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="interview-style" className="form-label">
                Interview Style:
              </label>
              <select
                id="interview-style"
                className="form-select"
                value={interviewStyle}
                onChange={(e) => setInterviewStyle(e.target.value)}
              >
                <option value="Mixed">Mixed (Recommended)</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Technical">Technical</option>
                <option value="Situational">Situational (STAR)</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty" className="form-label">
                Difficulty Level:
              </label>
              <select
                id="difficulty"
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startInterview}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2 w-full md:w-auto"
          >
            <Play className="w-4 h-4" />
            {loading ? 'Preparing Interview...' : 'Start Mock Interview'}
          </button>
        </div>
      </div>

      {/* Interview Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
        <h3 className="heading-tertiary text-blue-800">Interview Preparation Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-700 mb-2 text-sm">Before You Start:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Find a quiet, well-lit space</li>
              <li>• Have your resume and notes ready</li>
              <li>• Practice speaking clearly and confidently</li>
              <li>• Prepare examples using the STAR method</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-2 text-sm">During the Interview:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Take a moment to think before answering</li>
              <li>• Be specific and provide concrete examples</li>
              <li>• Stay calm and maintain good posture</li>
              <li>• It's okay to ask for clarification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renders the active interview page
   */
  const renderInterviewPage = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="animate-fade-in">
        {/* Progress Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Mock Interview - {jobRole}
            </h2>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Question */}
        <div className="card">
          <div className="question-card">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Question {currentQuestionIndex + 1}:
            </h3>
            <p className="text-gray-800 text-lg leading-relaxed">
              {currentQuestion}
            </p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeRemaining <= 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg font-bold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Answer Input */}
          <div className="form-group">
            <label htmlFor="answer-input" className="form-label flex items-center gap-2">
              <Type className="w-4 h-4" />
              Your Answer:
            </label>
            <textarea
              id="answer-input"
              className="form-textarea"
              rows="6"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here... Take your time to provide a detailed response."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleNextQuestion}
              className="btn btn-primary flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {currentQuestionIndex + 1 >= questions.length ? 'Finish Interview' : 'Next Question'}
            </button>
            
            <button
              onClick={handleSkipQuestion}
              className="btn btn-outline flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip Question
            </button>

            <button
              onClick={resetInterview}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              End Interview
            </button>
          </div>
        </div>

        {/* Interview Tips */}
        <div className="warning-box">
          <h4 className="font-medium text-yellow-800 mb-2 text-sm">💡 Answering Tips:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Use the STAR method: Situation, Task, Action, Result</li>
            <li>• Be specific with examples and quantify results when possible</li>
            <li>• Stay focused on the question being asked</li>
            <li>• It's better to give a complete answer than to rush</li>
          </ul>
        </div>
      </div>
    );
  };

  /**
   * Renders the evaluation results page
   */
  const renderEvaluationPage = () => (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="feature-icon bg-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h2 className="heading-secondary text-green-600">Interview Completed!</h2>
        <p className="text-body text-center">
          Great job completing your mock interview for {jobRole}. 
          Review your responses and feedback below.
        </p>
      </div>

      {/* Interview Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="heading-tertiary">Your Interview Responses</h3>
        </div>
        
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="question-card mb-3">
                <h4 className="font-semibold text-blue-800">Q{index + 1}: {question}</h4>
              </div>
              <div className="answer-card">
                <h4 className="font-semibold text-green-800 mb-2">Your Answer:</h4>
                <p className="text-gray-700">{responses[index] || '(No response provided)'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Evaluation */}
      {loading ? (
        <div className="card">
          <LoadingSpinner message="Evaluating your interview performance..." />
        </div>
      ) : evaluation ? (
        <div className="card">
          <div className="card-header">
            <h3 className="heading-tertiary text-purple-600 flex items-center gap-2">
              <Star className="w-5 h-5" />
              AI Interview Evaluation & Feedback
            </h3>
          </div>
          
          <div style={{
            backgroundColor: "#faf5ff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e9d5ff"
          }}>
            {convertMarkup(evaluation)}
          </div>
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={resetInterview}
          className="btn btn-primary flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start New Interview
        </button>
        
        <button
          onClick={() => setCurrentPage('setup')}
          className="btn btn-outline flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Change Settings
        </button>
      </div>
    </div>
  );

  // Error display
  if (error) {
    return (
      <div className="animate-fade-in">
        <Alert 
          type="error" 
          message={error} 
          onDismiss={() => setError('')} 
        />
        <div className="text-center mt-4">
          <button
            onClick={resetInterview}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate page based on current state
  switch (currentPage) {
    case 'setup':
      return renderSetupPage();
    case 'interview':
      return renderInterviewPage();
    case 'evaluation':
      return renderEvaluationPage();
    default:
      return renderSetupPage();
  }
};

export default MockInterview;