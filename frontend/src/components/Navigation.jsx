import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-gray-700 hover:text-primary block w-full px-4 py-2 text-sm md:text-base md:inline-block md:w-auto">Home</Link>
      <Link to="/symptom-checker" className="text-gray-700 hover:text-primary block w-full px-4 py-2 text-sm md:text-base md:inline-block md:w-auto">Symptom Checker</Link>
      <Link to="/awareness" className="text-gray-700 hover:text-primary block w-full px-4 py-2 text-sm md:text-base md:inline-block md:w-auto">Awareness</Link>
      <Link to="/contact" className="text-gray-700 hover:text-primary block w-full px-4 py-2 text-sm md:text-base md:inline-block md:w-auto">Contact</Link>
      {user ? (
        <>
          <Link to="/admin" className="text-gray-700 hover:text-primary block w-full px-4 py-2 text-sm md:text-base md:inline-block md:w-auto">Admin</Link>
          <button 
            onClick={handleLogout} 
            className="text-gray-700 hover:text-primary block w-full px-4 py-2 text-sm md:text-base md:inline-block md:w-auto text-left"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-gray-700 hover:text-primary block w-full px-4 py-2 text-sm md:text-base md:inline-block md:w-auto">Login</Link>
          <Link to="/signup" className="text-gray-700 hover:text-primary block w-full px-4 py-2 text-sm md:text-base md:inline-block md:w-auto">Signup</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">HumAi</Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLinks />
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-full opacity-0'
        }`}
      >
        <div className="px-4 pt-4 pb-4 space-y-2 bg-white shadow-lg">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;