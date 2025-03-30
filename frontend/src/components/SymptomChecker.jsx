import React, { useState, useCallback } from 'react';
import { symptomService } from '../services/symptomService';
import { uploadFile } from '../utils/storage';
import { useDropzone } from 'react-dropzone';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [results, setResults] = useState({
    possibleConditions: [],
    conditionProbabilities: [],
    generalAnalysis: '',
    urgencyLevel: 'N/A',
    recommendedActions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, file]);
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true
  });

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() && selectedImages.length === 0) {
      setError('Please describe your symptoms or upload at least one image');
      return;
    }

    setLoading(true);
    setError('');
    setResults({
      possibleConditions: [],
      conditionProbabilities: [],
      generalAnalysis: '',
      urgencyLevel: 'N/A',
      recommendedActions: []
    });

    try {
      let imageBase64Array = [];
      if (selectedImages.length > 0) {
        imageBase64Array = await Promise.all(
          selectedImages.map(async (file) => {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result.split(',')[1]);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          })
        );
      }

      const analysisReport = await symptomService.analyzeSymptoms(symptoms, imageBase64Array[0]);
      console.log('Symptom Analysis Response:', analysisReport);
      
      if (!analysisReport) {
        throw new Error('Invalid or empty response from Gemini API');
      }

      setResults(analysisReport);
      setError('');

      await new Promise(resolve => setTimeout(resolve, 100));
      
      const resultsSection = document.querySelector('.mt-8');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
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
    <div className="pt-12 min-h-screen bg-[#F5F5F5]">
      {/* Symptom Input Section */}
      <section className="py-6">
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              {/* Image Upload Section */}
              <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-center text-gray-600">Drop the images here ...</p>
                ) : (
                  <p className="text-center text-gray-600">
                    Drag & drop images here, or click to select files
                  </p>
                )}
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Symptom Input */}
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
              
              {/* Possible Conditions */}
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Possible Conditions</h3>
                <ul className="space-y-3">
                  {Array.isArray(results.possibleConditions) && results.possibleConditions.map((condition, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{condition}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {results.conditionProbabilities[index]}% probability
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* General Analysis */}
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">General Analysis</h3>
                <div className="text-gray-700">{results.generalAnalysis || 'No analysis available'}</div>
                <div className="mt-4 flex items-center">
                  <span className="text-gray-600 mr-2">Urgency Level:</span>
                  <UrgencyBadge level={results.urgencyLevel || 'N/A'} />
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {Array.isArray(results.recommendedActions) && results.recommendedActions.map((action, index) => (
                    <li key={index} className="text-gray-700">{action}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mt-6">
                <p className="text-blue-800 text-sm">
                  Note: This is an AI-powered analysis and should not be considered as medical advice.
                  Please consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SymptomChecker;