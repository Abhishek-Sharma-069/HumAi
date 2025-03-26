import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please check your environment variables.');
      }
      console.log('Gemini API Key:', import.meta.env.VITE_GEMINI_API_KEY);
      const prompt = `Act as a medical assistant. Based on these symptoms: "${symptoms}", provide a structured analysis including:
      1. Possible conditions (list top 2-3 with probability levels)
      2. Urgency level (Mild/Moderate/Severe)
      3. Recommended actions
      4. Warning signs that require immediate medical attention

      Format the response in a clear, structured way.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + import.meta.env.VITE_GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      const analysis = result.candidates[0].content.parts[0].text;
      console.log('Gemini API Response:', analysis); // Debug log

      // Parse the AI response to structure the results
      const conditions = [];
      const lines = analysis.split('\n');
      let currentCondition = null;
      let currentSection = '';
      let recommendations = [];
      let warnings = [];
      let urgencyLevel = 'Moderate';
      let isInConditionDescription = false;
      let isInRecommendationSublist = false;
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        // Section headers
        if (trimmedLine.match(/^\*\*\d+\. Possible Conditions/i)) {
          currentSection = 'conditions';
        } else if (trimmedLine.match(/^\*\*\d+\. Urgency Level/i)) {
          currentSection = 'urgency';
        } else if (trimmedLine.match(/^\*\*\d+\. Recommended Actions/i)) {
          currentSection = 'recommendations';
        } else if (trimmedLine.match(/^\*\*\d+\. Warning Signs/i)) {
          currentSection = 'warnings';
        } else if (currentSection === 'conditions' && trimmedLine.match(/^\*\*.*?\(.*?\):\*\*/)) {
          // New condition with probability
          isInConditionDescription = true;
          const conditionText = trimmedLine.replace(/^\*\*|:\*\*$/g, '');
          const probabilityMatch = conditionText.match(/\((.*?)\)/);
          currentCondition = {
            name: probabilityMatch ? conditionText.split('(')[0].trim() : conditionText.trim(),
            probability: probabilityMatch ? probabilityMatch[1].trim() : 'Unknown',
            description: '',
            urgency: urgencyLevel,
            recommendations: []
          };
          conditions.push(currentCondition);
        } else if (currentSection === 'conditions' && isInConditionDescription && currentCondition) {
          if (trimmedLine.startsWith('*')) {
            isInConditionDescription = false;
          } else {
            currentCondition.description += (currentCondition.description ? ' ' : '') + trimmedLine.replace(/\*\*/g, '');
          }
        } else if (currentSection === 'recommendations') {
          if (trimmedLine.match(/^\d+\.\s/)) {
            // Main recommendation
            const recommendation = trimmedLine.replace(/^\d+\.\s/, '').trim().replace(/\*\*/g, '');
            if (recommendation.endsWith(':')) {
              isInRecommendationSublist = true;
              recommendations.push({ main: recommendation.slice(0, -1), sub: [] });
            } else {
              isInRecommendationSublist = false;
              recommendations.push({ main: recommendation, sub: [] });
            }
          } else if (isInRecommendationSublist && (trimmedLine.startsWith('*') || trimmedLine.startsWith('-'))) {
            // Sub-recommendation (handle both * and - bullet points)
            const subRecommendation = trimmedLine.replace(/^[*-]\s/, '').trim().replace(/\*\*/g, '');
            if (recommendations.length > 0) {
              recommendations[recommendations.length - 1].sub.push(subRecommendation);
            }
          } else if (trimmedLine.startsWith('*')) {
            // Handle standalone bullet points as main recommendations
            const recommendation = trimmedLine.replace(/^\*\s/, '').trim().replace(/\*\*/g, '');
            recommendations.push({ main: recommendation, sub: [] });
          }
        } else if (currentSection === 'warnings' && trimmedLine.startsWith('*')) {
          const warning = trimmedLine.replace(/^\*\s/, '').trim().replace(/\*\*/g, '');
          if (warning) warnings.push(warning);
        } else if (currentSection === 'urgency' && trimmedLine.includes('*')) {
          const urgencyMatch = trimmedLine.match(/(Mild|Moderate|Severe)/i);
          if (urgencyMatch) {
            urgencyLevel = urgencyMatch[0];
            conditions.forEach(condition => {
              condition.urgency = urgencyLevel;
            });
          }
        }
      });

      // Ensure recommendations are properly assigned to conditions
      conditions.forEach(condition => {
        condition.recommendations = recommendations;
      });

      // Update conditions with structured recommendations
      conditions.forEach(condition => {
        condition.recommendations = recommendations;
      });

      // Clean up descriptions and ensure all sections have content
      conditions.forEach(condition => {
        condition.description = condition.description.replace(/\*\*/g, '').trim();
      });

      if (conditions.length === 0) {
        conditions.push({
          name: 'General Analysis',
          probability: 'N/A',
          description: 'Please consult with a healthcare professional for a proper evaluation.',
          urgency: urgencyLevel,
          recommendations: recommendations.length > 0 ? recommendations : ['Seek medical advice']
        });
      }

      // If no conditions were parsed, create a generic one with the full analysis
      if (conditions.length === 0) {
        conditions.push({
          name: 'Analysis Result',
          probability: 'N/A',
          urgency: urgencyLevel,
          recommendations: recommendations.length > 0 ? recommendations : ['Please consult with a healthcare professional for proper evaluation']
        });
      }

      setResults({
        conditions,
        fullAnalysis: analysis
      });
      setError('');
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      const errorMessage = error.message.includes('API key not valid') 
        ? 'Invalid API key. Please check your environment configuration.' 
        : 'Failed to analyze symptoms. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const UrgencyBadge = ({ level }) => {
    const colors = {
      Mild: 'bg-green-100 text-green-800',
      Moderate: 'bg-yellow-100 text-yellow-800',
      Severe: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${colors[level]}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Symptom Input Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <label htmlFor="symptoms" className="block text-lg font-medium mb-4">
                Describe your symptoms
              </label>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Example: fever, cough, headache..."
                className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full btn-primary py-3 rounded-lg flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Symptoms'
                )}
              </button>
            </div>
          </form>

          {/* Results Section */}
          {results && (
            <div className="mt-8 space-y-6">
              <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
              
              {/* Possible Conditions Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Possible Conditions</h3>
                {results.conditions.map((condition, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium">{condition.name}</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm px-3 py-1 rounded-full bg-gray-100">
                          <span className="font-medium text-gray-600">Probability: </span>
                          <span className="font-bold text-gray-800">{condition.probability}</span>
                        </div>
                        <UrgencyBadge level={condition.urgency} />
                      </div>
                    </div>
                    {condition.description && (
                      <p className="mt-2 text-gray-600">{condition.description}</p>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Recommended Actions Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
                <div className="space-y-4">
                  {results.conditions[0]?.recommendations?.map((rec, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="font-medium text-gray-800 mb-2">
                        {typeof rec === 'string' ? rec : rec.main}
                      </div>
                      {rec.sub && rec.sub.length > 0 && (
                        <ul className="ml-6 space-y-2">
                          {rec.sub.map((subRec, subIdx) => (
                            <li key={subIdx} className="text-gray-600 flex items-start">
                              <svg className="w-4 h-4 mr-2 mt-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                              {subRec}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Warning Signs Section */}
              {results.warnings && results.warnings.length > 0 && (
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Warning Signs - Seek Immediate Medical Attention
                  </h3>
                  <ul className="space-y-3">
                    {results.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start text-red-600">
                        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Important Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Important Notice</h4>
                    <p className="text-blue-700 leading-relaxed">
                      This AI-powered analysis is for informational purposes only and should not be considered as medical advice.
                      Always consult with a qualified healthcare professional for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SymptomChecker;