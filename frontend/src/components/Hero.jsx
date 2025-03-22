import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSymptomCheck = () => {
    if (user) {
      navigate('/symptom-checker');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-accent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your AI-Powered Health Companion
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Check your symptoms, get instant insights, and stay informed.
            </p>
            <div>
              <button 
                onClick={handleSymptomCheck}
                className="btn-primary text-lg"
              >
                Check Symptoms
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md relative">
              <div className="aspect-square rounded-2xl bg-white shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-full h-full text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;