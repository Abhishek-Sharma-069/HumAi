import React, { useState } from 'react';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulated API call - replace with actual AI integration
    setTimeout(() => {
      setResults({
        conditions: [
          {
            name: 'Common Cold',
            probability: 'High',
            urgency: 'Mild',
            recommendations: ['Rest', 'Stay hydrated', 'Over-the-counter medication']
          },
          {
            name: 'Seasonal Allergies',
            probability: 'Medium',
            urgency: 'Mild',
            recommendations: ['Antihistamines', 'Avoid triggers', 'Monitor symptoms']
          }
        ]
      });
      setLoading(false);
    }, 1500);
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
              {results.conditions.map((condition, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{condition.name}</h3>
                    <UrgencyBadge level={condition.urgency} />
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Probability:</span>
                    <span className="ml-2 font-medium">{condition.probability}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {condition.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-gray-600">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
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