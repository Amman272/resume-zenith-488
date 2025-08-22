/**
 * Mock Interview Component
 * Provides AI-powered mock interview experience with questions, timing, and evaluation
 * Supports different interview styles and difficulty levels
 */

import React, { useState, useEffect } from 'react';
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
          <div className="bg-primary-100 p-4 rounded-full">
            <MessageSquare className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="heading-secondary">AI-Powered Mock Interview</h2>
        <p className="text-body text-center max-w-2xl mx-auto">
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
      <div className="card bg-blue-50">
        <h3 className="heading-tertiary text-blue-800">Interview Preparation Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Before You Start:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Find a quiet, well-lit space</li>
              <li>• Have your resume and notes ready</li>
              <li>• Practice speaking clearly and confidently</li>
              <li>• Prepare examples using the STAR method</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">During the Interview:</h4>
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
            <h2 className="text-xl font-bold text-primary-900">
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
        <div className="card bg-yellow-50">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Answering Tips:</h4>
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
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="heading-secondary text-green-700">Interview Completed!</h2>
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
        <div className="card animate-slide-up">
          <div className="card-header">
            <h3 className="heading-tertiary text-purple-700 flex items-center gap-2">
              <Star className="w-5 h-5" />
              AI Interview Evaluation & Feedback
            </h3>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
            <div className="prose max-w-none">
              {evaluation.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                if (paragraph.match(/^\d+\.|^[•\-\*]|^#{1,3}|\*\*.*\*\*/)) {
                  return (
                    <div key={index} className="mb-4">
                      <h4 className="font-bold text-purple-800">{paragraph.replace(/[#*]/g, '')}</h4>
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