import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import TrendingArticles from './components/TrendingArticles';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import Awareness from './pages/Awareness';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import ArticleDetail from './pages/ArticleDetail';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
        <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Features />
          </main>
        } />
        <Route path="/symptom-checker" element={<PrivateRoute><SymptomCheckerPage /></PrivateRoute>} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/awareness/category/:id" element={<Awareness />} />
        <Route path="/awareness/article/:id" element={<ArticleDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        </Routes>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  )

}

export default App
