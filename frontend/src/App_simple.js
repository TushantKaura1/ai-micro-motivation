import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TaskService from './services/TaskService';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import NudgeCenter from './components/NudgeCenter';
import Stats from './components/Stats';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [user, setUser] = useState({
    user_id: 'default_user_123',
    name: 'AI Motivation User',
    email: 'user@example.com',
    streak: 0,
    total_points: 0
  });
  const [loading, setLoading] = useState(false);

  // Mock logout function (not needed but kept for compatibility)
  const handleLogout = () => {
    // In a single-user app, logout doesn't do anything
    console.log('Single-user app - logout not applicable');
  };

  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
        
        <div className="app-container">
          <Navigation user={user} onLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/tasks" element={<TaskManager user={user} />} />
              <Route path="/nudges" element={<NudgeCenter user={user} />} />
              <Route path="/stats" element={<Stats user={user} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
