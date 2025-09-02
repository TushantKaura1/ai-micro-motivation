import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthService from './services/AuthService';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import NudgeCenter from './components/NudgeCenter';
import Stats from './components/Stats';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      AuthService.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your motivation assistant...</p>
      </div>
    );
  }

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
        
        {user ? (
          <div className="app-container">
            <Navigation user={user} onLogout={handleLogout} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/tasks" element={<TaskManager user={user} />} />
                <Route path="/nudges" element={<NudgeCenter user={user} />} />
                <Route path="/stats" element={<Stats user={user} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
