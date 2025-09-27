import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

// Initialize Gemini AI with validated API key from environment config
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const makeGeminiRequest = async (prompt) => {
  try {
    // 4. For simple text, you can pass the prompt string directly
    const result = await model.generateContent(prompt);
    
    const response = result.response;
    
    // 2. Call the text() method to get the string output
    const text = response.text();
    
    console.log("--- Full Response Object ---");
    console.log(response);

    console.log("\n--- Generated Text ---");
    console.log(text);
    
    // 3. To access candidates (optional, usually for more advanced use)
    // console.log(response.candidates);

    return text; // Return the generated text

  } catch (error) {
    // 5. Add error handling
    console.error("Error making Gemini request:", error);
    return null;
  }
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

    const text = await makeGeminiRequest(prompt);
    
    if (!text) {
      return res.status(500).json({
        message: 'Failed to generate analysis',
        error: 'Gemini API returned no response'
      });
    }

    // Parse the response and structure it
    const analysis = {
      possibleConditions: [],
      generalAnalysis: '',
      probability: 'N/A',
      recommendedActions: []
    };

    // Extract information from the text response
    
    // Helper function to clean markdown formatting
    const cleanText = (text) => {
      return text.replace(/\*\*/g, '') // Remove bold formatting
                 .replace(/\*/g, '') // Remove remaining asterisks
                 .replace(/^\s*-\s*/, '') // Remove bullet point dashes
                 .trim();
    };
    
    // Extract Possible Conditions with Probability
    const conditionsMatch = text.match(/\*\*1\. Possible Conditions \(with Probability Levels\):\*\*\s*\n([\s\S]*?)(?=\*\*2\.|$)/);
    if (conditionsMatch) {
      analysis.possibleConditions = conditionsMatch[1]
        .split('\n')
        .filter(line => line.trim().length > 0) // Filter out empty lines
        .map(line => cleanText(line))
        .filter(item => item.length > 0 && !item.match(/^\d+\./)); // Remove numbered headers
    }
    
    // Extract overall probability/urgency level from the conditions
    const overallUrgencyMatch = text.match(/\*\*2\. Urgency Level:\*\*\s*\n[\s\*]*\*\*(Mild|Moderate|Severe)\*\*/);
    if (overallUrgencyMatch) {
      analysis.probability = overallUrgencyMatch[1];
    } else {
      // Fallback: try to determine probability from conditions
      const conditionsText = conditionsMatch ? conditionsMatch[1] : '';
      if (conditionsText.includes('High Probability') || conditionsText.includes('Severe')) {
        analysis.probability = 'High';
      } else if (conditionsText.includes('Moderate Probability') || conditionsText.includes('Moderate')) {
        analysis.probability = 'Moderate';
      } else if (conditionsText.includes('Low Probability') || conditionsText.includes('Mild')) {
        analysis.probability = 'Low';
      }
    }
    
    // Extract Recommended Actions
    const actionsMatch = text.match(/\*\*3\. Recommended Actions:\*\*\s*\n([\s\S]*?)(?=\*\*4\.|$)/);
    if (actionsMatch) {
      analysis.recommendedActions = actionsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('*') || line.trim().match(/^\s*\*\*/))
        .map(line => cleanText(line))
        .filter(item => item.length > 0);
    }
    
    // Extract General Analysis
    const analysisMatch = text.match(/\*\*5\. General Analysis:\*\*\s*\n([\s\S]*?)(?=\*\*Disclaimer|$)/);
    if (analysisMatch) {
      analysis.generalAnalysis = cleanText(analysisMatch[1]);
    }

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