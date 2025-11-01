import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Navbar } from './components/ui/navbar'
import { HomePage } from './components/HomePage'
import { TutorQuestionnaire } from './components/TutorQuestionnaire'
import { StudentQuestionnaire } from './components/StudentQuestionnaire'
import { Marketplace } from './components/Marketplace'
import { TutorProfile } from './components/TutorProfile'
import { Login } from './components/Login'
import { UserProfile } from './components/UserProfile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tutor-questionnaire" element={<TutorQuestionnaire />} />
            <Route path="/student-questionnaire" element={<StudentQuestionnaire />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile/:id" element={<TutorProfile />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App