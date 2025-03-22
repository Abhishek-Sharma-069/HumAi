import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import SymptomChecker from './components/SymptomChecker'
import SymptomCheckerPage from './pages/SymptomCheckerPage'
import Awareness from './pages/Awareness'
import ArticleDetail from './pages/ArticleDetail'
import Contact from './pages/Contact'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PrivateRoute from './components/PrivateRoute'

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
        </div>
      </Router>
    </AuthProvider>
  )

}

export default App
