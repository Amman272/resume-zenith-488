/**
 * Google Gemini AI Configuration
 * This file handles the setup and configuration of the Google Generative AI API
 * Used for generating career guidance, resume analysis, and interview questions
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// API key for Google Generative AI - In production, this should be in environment variables
const API_KEY = "";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the latest Gemini model for content generation
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export { model };
