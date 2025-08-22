
import { model } from '../config/gemini.js';

/**
 * Generates personalized career guidance based on user input
 * @param {string} userInput - User's skills, interests, and career goals
 * @returns {Promise<string>} - AI-generated career guidance
 */
export const getCareerGuidance = async (userInput) => {
  const prompt = `Provide comprehensive career guidance based on the following user input: ${userInput}. 
  Please include:
  1. Suitable career paths that match their skills and interests
  2. Specific skills they should develop or improve
  3. Industries and companies to explore
  4. Next steps they should take
  5. Potential challenges and how to overcome them
  
  Make the response practical and actionable.`;
  
  try {
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error('Error generating career guidance:', error);
    throw new Error(`Failed to generate career guidance: ${error.message}`);
  }
};

/**
 * Analyzes uploaded resume text and provides detailed feedback
 * @param {string} resumeText - Extracted text from uploaded PDF resume
 * @returns {Promise<string>} - AI-generated resume analysis and recommendations
 */
export const analyzeResume = async (resumeText) => {
  const prompt = `Analyze the following resume and provide comprehensive feedback:

Resume Content:
${resumeText}

Please provide:
1. Overall structure and formatting assessment
2. Strengths and positive aspects
3. Areas for improvement with specific suggestions
4. Missing skills or sections that should be added
5. Industry-specific recommendations
6. ATS (Applicant Tracking System) optimization tips
7. A rating from 1-10 with detailed reasoning
8. Specific action items to improve the resume

Make the feedback constructive and actionable.`;
  
  try {
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
};

/**
 * Generates a personalized learning path for specified skills
 * @param {string} skills - Comma-separated list of skills to learn
 * @returns {Promise<string>} - AI-generated learning path with resources
 */
export const getLearningPath = async (skills) => {
  const prompt = `Create a comprehensive, personalized learning path for the following skills: ${skills}.

Please include:
1. Learning roadmap with clear progression steps
2. Recommended courses from platforms like Coursera, Udemy, edX, LinkedIn Learning
3. Free resources and tutorials
4. Books and documentation to read
5. Hands-on projects to build practical experience
6. Certifications worth pursuing
7. Estimated timeline for each learning phase
8. Tips for effective learning and skill development

Structure the response in a clear, step-by-step format.`;
  
  try {
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw new Error(`Failed to generate learning path: ${error.message}`);
  }
};

/**
 * Finds the best YouTube channels for learning specific skills
 * @param {string} skills - Skills to find YouTube channels for
 * @returns {Promise<Array>} - Array of YouTube channel objects with name, link, and description
 */
export const getBestYouTubeChannels = async (skills) => {
  const prompt = `Based on the following skills: ${skills}, recommend 6 of the best YouTube channels for free learning resources.

For each channel, provide:
1. The exact channel name
2. A working YouTube channel URL (format: https://www.youtube.com/@channelname or https://www.youtube.com/c/channelname)
3. A detailed description of what the channel offers related to the skills
4. The type of content they create (tutorials, projects, theory, etc.)
5. Skill level (beginner, intermediate, advanced, or mixed)

Format the response as a numbered list with each channel clearly separated.`;
  
  try {
    const response = await model.generateContent(prompt);
    const channelsText = response.response.text();
    
    // Parse the response into structured data
    const channels = [];
    const lines = channelsText.split('\n').filter(line => line.trim());
    
    let currentChannel = {};
    for (const line of lines) {
      if (line.match(/^\d+\./)) {
        // New channel entry
        if (Object.keys(currentChannel).length > 0) {
          channels.push(currentChannel);
        }
        currentChannel = {
          name: line.replace(/^\d+\.\s*/, '').trim(),
          link: '',
          description: '',
          contentType: '',
          skillLevel: ''
        };
      } else if (line.includes('youtube.com') || line.includes('youtu.be')) {
        //  YouTube URL
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          currentChannel.link = urlMatch[1];
        }
      } else if (line.trim()) {
        // description
        currentChannel.description += (currentChannel.description ? ' ' : '') + line.trim();
      }
    }
    
    // last channel
    if (Object.keys(currentChannel).length > 0) {
      channels.push(currentChannel);
    }
    
    return channels;
  } catch (error) {
    console.error('Error fetching YouTube channels:', error);
    throw new Error(`Failed to fetch YouTube channels: ${error.message}`);
  }
};

/**
 * Generates current job market insights and trends
 * @returns {Promise<Object>} - Job market data including trending roles, skills, and salaries
 */
export const getJobMarketInsights = async () => {
  const prompt = `Generate comprehensive current job market insights for 2024-2025 including:

1. Top 8 trending job roles in technology and other growing industries
2. Top 8 emerging skills that are in highest demand
3. Salary trends for popular roles (entry, mid, senior levels)
4. Industry growth predictions
5. Remote work trends and impact
6. Skills gap analysis
7. Geographic trends (which regions are hiring most)
8. Future predictions for the next 2-3 years

Present the information in a structured, detailed format with specific data points where possible.`;
  
  try {
    const response = await model.generateContent(prompt);
    return {
      ai_generated: true,
      insights: response.response.text()
    };
  } catch (error) {
    console.error('Error generating job market insights:', error);
    // Return fallback data if AI fails
    return {
      ai_generated: false,
      trending_roles: [
        { role: "AI/ML Engineer", growth: "35%", description: "Developing AI systems and machine learning models" },
        { role: "Data Scientist", growth: "28%", description: "Analyzing complex data to drive business decisions" },
        { role: "Cloud Architect", growth: "30%", description: "Designing and implementing cloud infrastructure" },
        { role: "DevOps Engineer", growth: "25%", description: "Bridging development and operations" },
        { role: "Cybersecurity Specialist", growth: "32%", description: "Protecting systems from cyber threats" },
        { role: "Full Stack Developer", growth: "22%", description: "Building complete web applications" },
        { role: "Product Manager", growth: "20%", description: "Managing product development lifecycle" },
        { role: "UX/UI Designer", growth: "18%", description: "Creating user-centered design experiences" }
      ],
      emerging_skills: [
        { skill: "Generative AI", demand: "Very High", adoption: "Rapidly growing across all industries" },
        { skill: "Cloud Computing", demand: "Very High", adoption: "Essential for modern infrastructure" },
        { skill: "Cybersecurity", demand: "Very High", adoption: "Critical for all organizations" },
        { skill: "Data Analytics", demand: "High", adoption: "Key for data-driven decision making" },
        { skill: "DevOps", demand: "High", adoption: "Standard in modern development" },
        { skill: "Mobile Development", demand: "High", adoption: "Growing with mobile-first strategies" },
        { skill: "Blockchain", demand: "Medium", adoption: "Emerging in finance and supply chain" },
        { skill: "IoT Development", demand: "Medium", adoption: "Growing in manufacturing and smart cities" }
      ],
      salary_trends: [
        { role: "AI/ML Engineer", entry_level: "$95,000", mid_level: "$135,000", senior_level: "$180,000+" },
        { role: "Data Scientist", entry_level: "$90,000", mid_level: "$125,000", senior_level: "$160,000+" },
        { role: "Cloud Architect", entry_level: "$100,000", mid_level: "$140,000", senior_level: "$185,000+" },
        { role: "DevOps Engineer", entry_level: "$85,000", mid_level: "$120,000", senior_level: "$155,000+" },
        { role: "Cybersecurity Specialist", entry_level: "$88,000", mid_level: "$128,000", senior_level: "$170,000+" }
      ]
    };
  }
};

/**
 * Generates professional networking suggestions for a specific industry
 * @param {string} industry - Industry or field of interest
 * @param {string} careerStage - Current career stage (entry, mid, senior, executive)
 * @param {string} goal - Networking goal (job search, advancement, insights, mentorship)
 * @returns {Promise<string>} - AI-generated networking strategies and tips
 */
export const getNetworkingSuggestions = async (industry, careerStage = 'Mid-Career', goal = 'General') => {
  const prompt = `Provide comprehensive professional networking suggestions for someone in ${industry} at the ${careerStage} level with a focus on ${goal}.

Include:
1. Industry-specific networking strategies
2. Key professional associations and organizations to join
3. Important conferences, events, and meetups to attend
4. LinkedIn optimization tips for this industry
5. Online communities and forums to participate in
6. Mentorship opportunities and how to find mentors
7. Personal branding strategies
8. Networking conversation starters and tips
9. Follow-up strategies after networking events
10. Virtual networking best practices

Make the advice specific to the industry and career stage provided.`;
  
  try {
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error('Error generating networking suggestions:', error);
    throw new Error(`Failed to generate networking suggestions: ${error.message}`);
  }
};

/**
 * Generates interview questions for a specific job role
 * @param {string} jobRole - The job role to generate questions for
 * @param {number} numQuestions - Number of questions to generate
 * @param {string} interviewStyle - Style of interview (behavioral, technical, etc.)
 * @param {string} difficulty - Difficulty level (easy, medium, hard, expert)
 * @returns {Promise<Array>} - Array of interview questions
 */
export const generateInterviewQuestions = async (jobRole, numQuestions, interviewStyle = 'Mixed', difficulty = 'Medium') => {
  const prompt = `Generate ${numQuestions} unique and highly relevant interview questions for a ${jobRole} position.

Requirements:
- Interview style: ${interviewStyle}
- Difficulty level: ${difficulty}
- Include a mix of behavioral, technical, and situational questions appropriate for this role
- Questions should be realistic and commonly asked in actual interviews
- Avoid generic questions - make them specific to ${jobRole}
- Each question should be clear and well-structured

Format: Return only the questions, one per line, without numbering or prefixes.`;
  
  try {
    const response = await model.generateContent(prompt);
    const questionsText = response.response.text();
    
    // Parse questions from the response
    let questions = questionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.match(/^\d+\.?\s*/))
      .slice(0, numQuestions);
    
    // Ensure we have enough questions
    if (questions.length < numQuestions) {
      const defaultQuestions = [
        "Tell me about yourself and your background.",
        "What interests you most about this role?",
        "Describe a challenging project you've worked on.",
        "How do you handle tight deadlines and pressure?",
        "What are your greatest strengths and weaknesses?",
        "Where do you see yourself in 5 years?",
        "Why do you want to work for our company?",
        "Describe a time when you had to learn something new quickly.",
        "How do you prioritize your work when you have multiple deadlines?",
        "What questions do you have for us?"
      ];
      
      const needed = numQuestions - questions.length;
      questions = [...questions, ...defaultQuestions.slice(0, needed)];
    }
    
    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    // Return default questions if AI fails
    return getDefaultQuestions(numQuestions);
  }
};

/**
 * Fallback function to provide default interview questions
 * @param {number} numQuestions - Number of questions needed
 * @returns {Array} - Array of default interview questions
 */
const getDefaultQuestions = (numQuestions) => {
  const defaultQuestions = [
    "Tell me about yourself and your professional background.",
    "What are your greatest strengths and how do they apply to this role?",
    "Describe a challenging situation you faced at work and how you handled it.",
    "Why are you interested in this position and our company?",
    "Where do you see yourself in 5 years?",
    "How do you handle pressure and tight deadlines?",
    "What is your greatest professional achievement?",
    "How do you prioritize your work when you have multiple projects?",
    "Describe a time when you had to work with a difficult team member.",
    "What questions do you have for us about the role or company?"
  ];
  
  return defaultQuestions.slice(0, numQuestions);
};

/**
 * Evaluates interview responses and provides detailed feedback
 * @param {string} jobRole - The job role being interviewed for
 * @param {Array} questions - Array of interview questions
 * @param {Array} responses - Array of user responses
 * @returns {Promise<string>} - AI-generated evaluation and feedback
 */
export const evaluateInterview = async (jobRole, questions, responses) => {
  const prompt = `Evaluate the following mock interview for a ${jobRole} position and provide comprehensive feedback:

Interview Questions and Responses:
${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${responses[i] || '(No response provided)'}`).join('\n\n')}

Please provide:
1. **Overall Performance Assessment** (1-10 score with reasoning)
2. **Strengths Demonstrated** - Specific examples from responses
3. **Areas for Improvement** - Detailed, actionable feedback
4. **Communication Skills Analysis** - Clarity, structure, confidence
5. **Role-Specific Evaluation** - How well responses align with ${jobRole} requirements
6. **STAR Method Usage** - Assessment of Situation, Task, Action, Result structure
7. **Recommended Improvements** - Specific steps to enhance interview performance
8. **Follow-up Questions** - 3 additional questions a real interviewer might ask
9. **Final Recommendations** - Key takeaways and next steps

Make the feedback constructive, specific, and actionable for interview improvement.`;
  
  try {
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (error) {
    console.error('Error evaluating interview:', error);
    throw new Error(`Failed to evaluate interview: ${error.message}`);
  }
};