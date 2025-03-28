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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-gray-700 hover:text-primary block md:inline-block py-2 md:py-0">Home</Link>
      <Link to="/symptom-checker" className="text-gray-700 hover:text-primary block md:inline-block py-2 md:py-0">Symptom Checker</Link>
      <Link to="/awareness" className="text-gray-700 hover:text-primary block md:inline-block py-2 md:py-0">Awareness</Link>
      <Link to="/contact" className="text-gray-700 hover:text-primary block md:inline-block py-2 md:py-0">Contact</Link>
      {user ? (
        <>
          <Link to="/admin" className="text-gray-700 hover:text-primary block md:inline-block py-2 md:py-0">Admin</Link>
          <button 
            onClick={handleLogout} 
            className="text-gray-700 hover:text-primary block md:inline-block py-2 md:py-0 w-full text-left"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-gray-700 hover:text-primary block md:inline-block py-2 md:py-0">Login</Link>
          <Link to="/signup" className="text-gray-700 hover:text-primary block md:inline-block py-2 md:py-0">Signup</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="relative">
      {isMobile ? (
        <>
          <button 
            onClick={toggleMenu} 
            className="p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          <div 
            className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
          >
            <NavLinks />
          </div>
        </>
      ) : (
        <div className="space-x-4">
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

export default Navigation;