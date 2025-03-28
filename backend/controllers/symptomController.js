import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

// Initialize Gemini AI with validated API key from environment config
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const makeGeminiRequest = async (prompt) => {
  const result = await model.generateContent({
    contents: [{
      parts: [{ text: prompt }]
    }]
  });

  const response = await result.response;
  return response;
};

// @desc Analyze symptoms using Gemini API
// @route POST /api/health/analyze-symptoms
const analyzeSymptoms = async (req, res) => {
  try {
    // Validate request body
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ message: 'Please provide symptoms' });
    }

    const prompt = `Act as a personnel medical assistant. Based on these symptoms: "${symptoms}", provide a structured analysis including:
      1. Possible conditions (list top 2-3 with probability levels of disease)
      2. Urgency level (Mild/Moderate/Severe)
      3. Recommended actions
      4. Warning signs that require immediate medical attention
      5. General analysis

      Format the response in a clear, structured way.`;

    const result = await makeGeminiRequest(prompt);
    const text = result.candidates[0].content.parts[0].text;

    // Parse the response and structure it
    const analysis = {
      possibleConditions: [],
      generalAnalysis: '',
      probability: 'N/A',
      recommendedActions: []
    };

    // Extract information from the text response
    const sections = text.split('\n');
    sections.forEach(section => {
      if (section.includes('Possible conditions')) {
        analysis.possibleConditions = section
          .replace('Possible conditions:', '')
          .split('-')
          .filter(item => item.trim())
          .map(item => item.trim());
      } else if (section.includes('Urgency level')) {
        const urgencyMatch = section.match(/(Mild|Moderate|Severe)/);
        if (urgencyMatch) {
          analysis.probability = urgencyMatch[0];
        }
      } else if (section.includes('Recommended actions')) {
        analysis.recommendedActions = section
          .replace('Recommended actions:', '')
          .split('-')
          .filter(item => item.trim())
          .map(item => item.trim());
      } else if (section.includes('General analysis')) {
        analysis.generalAnalysis = section
          .replace('General analysis:', '')
          .trim();
      }
    });

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    
    // Handle specific API key related errors
    if (error.message.includes('API key not valid') || error.message.includes('INVALID_ARGUMENT')) {
      return res.status(401).json({
        message: 'Invalid API key or model configuration',
        error: 'Please ensure a valid Gemini API key is configured and the model name is correct.'
      });
    }
    
    // Handle other API errors
    res.status(500).json({
      message: 'Failed to analyze symptoms',
      error: 'An error occurred while processing your request. Please try again later.'
    });
  }
};

export { analyzeSymptoms };