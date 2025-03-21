import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signInWithGoogle, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Successfully logged in');
      navigate('/');
    } catch (error) {
      const errorMessage = 
        error.code === 'auth/wrong-password' ? 'Invalid password' :
        error.code === 'auth/user-not-found' ? 'User not found' :
        error.code === 'auth/invalid-email' ? 'Invalid email format' :
        error.code === 'auth/invalid-credential' ? 'Invalid email or password' :
        error.code === 'auth/too-many-requests' ? 'Too many failed attempts. Please try again later' :
        'An error occurred during login. Please try again';
      console.error('Login error:', error.code);
      setError(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      console.log('Successfully signed in with Google');
      navigate('/');
    } catch (error) {
      const errorMessage = 
        error.code === 'auth/popup-closed-by-user' ? 'Sign-in cancelled. Please try again' :
        error.code === 'auth/popup-blocked' ? 'Sign-in popup was blocked. Please enable popups and try again' :
        error.code === 'auth/unauthorized-domain' ? 'This domain is not authorized for Google sign-in' :
        'Failed to sign in with Google. Please try again';
      console.error('Google sign-in error:', error.code);
      setError(errorMessage);
    }
  };

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className={`mt-4 w-full flex items-center justify-center gap-3 px-4 py-2 bg-primary text-white rounded-lg transition duration-200 ${authLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 bg-white rounded-full p-1"
            />
            Sign in with Google
          </button>
        </div>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;