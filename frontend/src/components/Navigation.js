import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Zap, BarChart3, LogOut, User } from 'lucide-react';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/nudges', icon: Zap, label: 'Nudges' },
    { path: '/stats', icon: BarChart3, label: 'Stats' },
  ];

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🚀 Micro Motivation
        </Link>

        <div className="nav-user">
          <div className="nav-user-info">
            <div className="nav-user-name">{user.name}</div>
            <div className="nav-user-stats">
              {user.streak} day streak • {user.total_points} points
            </div>
          </div>
          <button onClick={onLogout} className="nav-logout" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <div className="mobile-nav-items">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
