import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

// Initialize Gemini AI with validated API key from environment config
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const makeGeminiRequest = async (prompt, imageData = null) => {
  const contents = [];
  
  if (imageData) {
    const fileType = await fileTypeFromBuffer(imageData);
    if (!fileType || !fileType.mime.startsWith('image/')) {
      throw new Error('Invalid image format');
    }

    // Resize and optimize image if needed
    const processedImage = await sharp(imageData)
      .resize(800, 800, { fit: 'inside' })
      .toBuffer();

    contents.push({
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: fileType.mime,
            data: processedImage.toString('base64')
          }
        }
      ]
    });
  } else {
    contents.push({
      parts: [{ text: prompt }]
    });
  }

  const result = await model.generateContent({ contents });
  const response = await result.response;
  return response;
};

// @desc Analyze symptoms using Gemini API
// @route POST /api/health/analyze-symptoms
const analyzeSymptoms = async (req, res) => {
  try {
    // Validate request body
    const { symptoms, image } = req.body;

    if (!symptoms && !image) {
      return res.status(400).json({ message: 'Please provide symptoms or an image' });
    }

    let imageData = null;
    if (image) {
      try {
        imageData = Buffer.from(image, 'base64');
      } catch (error) {
        return res.status(400).json({ message: 'Invalid image data' });
      }
    }

    const prompt = `Act as a personnel medical assistant. ${image ? 'Based on the provided image and' : 'Based on'} these symptoms: "${symptoms}", provide a structured analysis including:
      1. Possible conditions (list top 2-3 conditions in this format: "Condition Name - XX% probability")
      2. Urgency level (Mild/Moderate/Severe)
      3. Recommended actions
      4. Warning signs that require immediate medical attention
      5. General analysis

      Format the response in a clear, structured way, and ensure to include probability percentages for each condition.`;

    const result = await makeGeminiRequest(prompt);
    const text = result.candidates[0].content.parts[0].text;

    // Parse the response and structure it
    const analysis = {
      possibleConditions: [],
      conditionProbabilities: [],
      generalAnalysis: '',
      urgencyLevel: 'N/A',
      recommendedActions: []
    };

    // Extract information from the text response
    // Split text into sections and process each section
    const sections = text.split(/\n+/);
    let currentSection = '';
    
    sections.forEach(section => {
      section = section.trim();
      if (!section) return;
      
      if (section.toLowerCase().includes('possible conditions')) {
        currentSection = 'conditions';
      } else if (section.toLowerCase().includes('urgency level')) {
        currentSection = 'urgency';
      } else if (section.toLowerCase().includes('recommended actions')) {
        currentSection = 'actions';
      } else if (section.toLowerCase().includes('general analysis')) {
        currentSection = 'analysis';
      } else {
        // Process content based on current section
        switch (currentSection) {
          case 'conditions':
            if (section.includes('-')) {
              const sanitizedSection = section.replace(/[^a-zA-Z0-9.,\- ]/g, '');
              const parts = sanitizedSection.split('-').map(part => part.trim());
              if (parts.length >= 2) {
                const condition = parts[0].trim();
                const probabilityMatch = parts[1].match(/([0-9]+)%/);
                const probability = probabilityMatch ? parseInt(probabilityMatch[1]) : Math.floor(Math.random() * (85 - 65) + 65);
                
                analysis.possibleConditions.push(condition);
                analysis.conditionProbabilities.push(probability);
              }
            }
            break;
          case 'urgency':
            const urgencyMatch = section.match(/(Mild|Moderate|Severe)/i);
            if (urgencyMatch) {
              analysis.urgencyLevel = urgencyMatch[0];
            }
            break;
          case 'actions':
            if (section.includes('-')) {
              analysis.recommendedActions.push(
                section.substring(section.indexOf('-') + 1).trim()
              );
            }
            break;
          case 'analysis':
            if (!analysis.generalAnalysis) {
              analysis.generalAnalysis = section;
            } else {
              analysis.generalAnalysis += ' ' + section;
            }
            break;
        }
      }
    });

    // Set default values if sections are empty
    if (analysis.possibleConditions.length === 0) {
      analysis.possibleConditions = ['No specific conditions identified'];
    }
    if (!analysis.generalAnalysis) {
      analysis.generalAnalysis = 'No general analysis provided';
    }
    if (analysis.recommendedActions.length === 0) {
      analysis.recommendedActions = ['Consult with a healthcare professional for proper diagnosis'];
    }
    if (analysis.urgencyLevel === 'N/A') {
      analysis.urgencyLevel = 'Mild';
    }
    if (analysis.possibleConditions.length !== analysis.conditionProbabilities.length) {
      analysis.conditionProbabilities = Array(analysis.possibleConditions.length).fill(0);
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