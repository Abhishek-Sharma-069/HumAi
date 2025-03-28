import axios from 'axios';


const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY in .env file.');
}
if (GEMINI_API_KEY === 'your-gemini-api-key') {
  throw new Error('Please replace the default Gemini API key with your actual API key in .env file.');
}

if (!GEMINI_API_KEY) {
  console.error('Gemini API key not found. Please check your environment variables.');
  throw new Error('Gemini API key not found. Ensure VITE_GEMINI_API_KEY is set in your .env file.');
}

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const geminiApi = axios.create({
  baseURL: GEMINI_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const geminiService = {
  generateContent: async (prompt) => {
    try {
      const response = await geminiApi.post(`/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
        'contents': [{
          'parts': [{
            'text': prompt
          }]
        }]
      });
      
      if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
        throw new Error('Invalid response format from Gemini API');
      }

      let rawText = response.data.candidates[0].content.parts[0].text;
      
      // Remove markdown formatting
      rawText = rawText.replace(/\*\*/g, '').replace(/\*/g, '');
      
      // Parse the response into structured sections
      const analysisReport = {
        possibleConditions: [],
        generalAnalysis: '',
        probability: 'N/A',
        recommendedActions: []
      };

      // Extract sections from the raw text using more robust pattern matching
      const sections = rawText.split(/(?:\r?\n){2,}/); // Split on two or more newlines
      
      // First pass: Look for urgency/probability level
      sections.forEach(section => {
        const sectionLower = section.toLowerCase().trim();
        if (sectionLower.includes('urgency') || sectionLower.includes('probability')) {
          const urgencyMatch = section.match(/(?:urgency|probability)[^\n]*?(?:mild|moderate|severe)/i);
          if (urgencyMatch) {
            const level = urgencyMatch[0].match(/(?:mild|moderate|severe)/i)[0];
            analysisReport.probability = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
          }
        }
      });

      // Second pass: Extract other sections
      sections.forEach(section => {
        const sectionLower = section.toLowerCase().trim();
        const lines = section.split('\n').map(line => line.trim()).filter(Boolean);
        
        if (sectionLower.includes('condition') || sectionLower.startsWith('possible conditions')) {
          analysisReport.possibleConditions = lines
            .filter(line => !line.toLowerCase().includes('condition') && line.length > 0)
            .map(line => line.replace(/^[-*•]\s*/, '')); // Remove list markers
        } 
        else if (sectionLower.includes('analysis') || sectionLower.startsWith('general analysis')) {
          analysisReport.generalAnalysis = lines
            .filter(line => !line.toLowerCase().includes('analysis'))
            .map(line => line.replace(/^[-*•]\s*/, ''))
            .join('\n');
        } 
        else if (sectionLower.includes('probability')) {
          const probMatch = section.match(/probability[:\s]+(\w+)/i);
          if (probMatch) {
            analysisReport.probability = probMatch[1];
          }
        } 
        else if (sectionLower.includes('recommend') || sectionLower.includes('action')) {
          analysisReport.recommendedActions = lines
            .filter(line => !line.toLowerCase().includes('recommend') && !line.toLowerCase().includes('action'))
            .map(line => line.replace(/^[-*•]\s*/, '')) // Remove list markers
            .filter(line => line.length > 0);
        }
      });
      
      // Ensure all sections have default values if empty
      if (!analysisReport.generalAnalysis) {
        analysisReport.generalAnalysis = 'No general analysis provided.';
      }
      if (analysisReport.recommendedActions.length === 0) {
        analysisReport.recommendedActions = ['No specific recommendations provided.'];
      }
      if (analysisReport.possibleConditions.length === 0) {
        analysisReport.possibleConditions = ['No conditions identified.'];
      }
      if (!analysisReport.probability || analysisReport.probability === 'N/A') {
        analysisReport.probability = 'Not specified';
      }
      
      return analysisReport;
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          throw new Error('Invalid request format or parameters');
        } else if (status === 401) {
          throw new Error('Invalid API key');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later');
        }
        throw new Error(data.error?.message || 'Failed to get response from Gemini API');
      }
      throw error;
    }
  },

  // Add more Gemini API methods as needed
};

export default geminiService;