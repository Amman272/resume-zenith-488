# Backend Services

This folder contains all backend-related services and configurations for the AI Career Guide application.

## Structure

```
src/backend/
├── services/          # AI and external services
│   ├── aiService.js   # Google Gemini AI integration
│   └── pdfService.js  # PDF processing utilities
├── config/            # Configuration files
│   └── gemini.js      # Gemini AI configuration
└── README.md          # This file
```

## Services Overview

### AI Service (`services/aiService.js`)
Handles all AI-related functionality:
- Career guidance generation
- Resume analysis
- Learning path creation
- YouTube channel recommendations
- Mock interview question generation
- Job market insights
- Networking suggestions

### PDF Service (`services/pdfService.js`)
Handles PDF processing:
- Extract text from uploaded PDF files
- Resume parsing and formatting

### Configuration (`config/gemini.js`)
Contains Google Gemini AI configuration and initialization.

## Usage

All services are imported and used by the frontend components. The AI service is the main interface for all AI-powered features in the application.

## Environment Variables

Make sure to set up your Google Gemini API key in your environment variables:
```
VITE_GEMINI_API_KEY=your_api_key_here
```