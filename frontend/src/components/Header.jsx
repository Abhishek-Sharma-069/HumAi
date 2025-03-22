import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">HumAi</h1>
        </div>
        
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full bg-white shadow-md md:shadow-none md:static md:flex md:w-auto items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0`}>
          <Link to="/" className="nav-link block">Home</Link>
          <Link to="/symptom-checker" className="nav-link block">Symptom Checker</Link>
          <Link to="/awareness" className="nav-link block">Awareness</Link>
          <Link to="/contact" className="nav-link block">Contact</Link>
          {user ? (
            <>
              <Link to="/symptom-checker" className="btn-primary block w-full md:w-auto text-center">Get Started</Link>
              <button onClick={handleLogout} className="btn-primary block w-full md:w-auto text-center bg-red-600 hover:bg-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary block w-full md:w-auto text-center">Login</Link>
              <Link to="/signup" className="btn-primary block w-full md:w-auto text-center">Sign Up</Link>
            </>
          )}
        </nav>
 
        {!user && (
          <Link to="/signup" className="btn-primary hidden md:block">
            Get Started
          </Link>
        )}

        <button 
          className="md:hidden p-2" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;