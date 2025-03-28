import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">HumAi</Link>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
          <Link to="/symptom-checker" className="text-gray-700 hover:text-primary">Symptom Checker</Link>
          <Link to="/awareness" className="text-gray-700 hover:text-primary">Awareness</Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary">Contact</Link>
          {user ? (
            <>
              <Link to="/admin" className="text-gray-700 hover:text-primary">Admin</Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary">Login</Link>
              <Link to="/signup" className="text-gray-700 hover:text-primary">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;