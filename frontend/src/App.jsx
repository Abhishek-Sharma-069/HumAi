import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import ConnectionStatus from './components/ConnectionStatus';
import TrendingArticles from './components/TrendingArticles';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import Awareness from './pages/Awareness';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import ArticleDetail from './pages/ArticleDetail';
import AdminPanel from './admin/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import FirestoreData from './components/FirestoreData'; // Add this import
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/admin/*" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
            <Route path="/firestore-data" element={<FirestoreData />} /> {/* Add this route */}
          </Routes>
          <Footer />
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
