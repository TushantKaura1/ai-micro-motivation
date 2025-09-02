import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, Smile, Frown, Meh, Sparkles, Heart } from 'lucide-react';
import TaskService from '../services/TaskService';
import toast from 'react-hot-toast';

const NudgeCenter = ({ user }) => {
  const [currentNudge, setCurrentNudge] = useState('');
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState('neutral');
  const [nudgeHistory, setNudgeHistory] = useState([]);

  const moodOptions = [
    { value: 'positive', icon: Smile, label: 'Great!', color: '#10b981' },
    { value: 'neutral', icon: Meh, label: 'Okay', color: '#6b7280' },
    { value: 'negative', icon: Frown, label: 'Struggling', color: '#ef4444' },
  ];

  const getNudge = async (selectedMood = mood) => {
    setLoading(true);
    try {
      const response = await TaskService.getNudge(selectedMood);
      setCurrentNudge(response.nudge);
      
      // Add to history
      setNudgeHistory(prev => [{
        id: Date.now(),
        nudge: response.nudge,
        mood: selectedMood,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)]); // Keep only last 5
      
      toast.success('Fresh motivation delivered! ✨');
    } catch (error) {
      toast.error('Failed to get nudge');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodChange = (newMood) => {
    setMood(newMood);
    getNudge(newMood);
  };

  useEffect(() => {
    // Get initial nudge
    getNudge();
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-header"
      >
        <h1 className="dashboard-title">Motivation Center ⚡</h1>
        <p className="dashboard-subtitle">
          Your AI coach is here to keep you moving forward
        </p>
      </motion.div>

      {/* Current Nudge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="nudge-card"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Sparkles size={24} style={{ marginRight: '8px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Your Personal Nudge</h3>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner" style={{ marginRight: '12px' }}></div>
            <span>Generating your personalized motivation...</span>
          </div>
        ) : (
          <>
            <div className="nudge-text">
              {currentNudge || "Hey there! Ready to tackle your next micro-step? You've got this! 💪"}
            </div>
            
            <div className="nudge-actions">
              <button
                onClick={() => getNudge()}
                className="nudge-btn"
                disabled={loading}
              >
                <RefreshCw size={16} />
                New Nudge
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Mood Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
        style={{ marginBottom: '24px' }}
      >
        <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
          How are you feeling right now?
        </h3>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {moodOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = mood === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handleMoodChange(option.value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px',
                  border: `2px solid ${isSelected ? option.color : '#e5e7eb'}`,
                  borderRadius: '12px',
                  background: isSelected ? `${option.color}10` : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '100px'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.borderColor = option.color;
                    e.target.style.background = `${option.color}05`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = 'white';
                  }
                }}
              >
                <Icon 
                  size={32} 
                  style={{ color: isSelected ? option.color : '#9ca3af' }} 
                />
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: isSelected ? option.color : '#6b7280'
                }}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
        style={{ marginBottom: '24px' }}
      >
        <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
          Quick Motivation Actions
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <button
            onClick={() => getNudge('positive')}
            className="btn btn-success"
            style={{ padding: '16px', fontSize: '16px' }}
          >
            <Sparkles size={20} />
            I'm Feeling Great!
          </button>
          
          <button
            onClick={() => getNudge('neutral')}
            className="btn btn-secondary"
            style={{ padding: '16px', fontSize: '16px' }}
          >
            <Zap size={20} />
            Give Me Energy
          </button>
          
          <button
            onClick={() => getNudge('negative')}
            className="btn btn-primary"
            style={{ padding: '16px', fontSize: '16px' }}
          >
            <Heart size={20} />
            I Need Support
          </button>
        </div>
      </motion.div>

      {/* Nudge History */}
      {nudgeHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
            Recent Nudges
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {nudgeHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px' 
                  }}>
                    {moodOptions.find(opt => opt.value === item.mood)?.icon && 
                      React.createElement(moodOptions.find(opt => opt.value === item.mood).icon, {
                        size: 16,
                        style: { 
                          color: moodOptions.find(opt => opt.value === item.mood).color 
                        }
                      })
                    }
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      textTransform: 'capitalize'
                    }}>
                      {item.mood} mood
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#9ca3af'
                  }}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p style={{ 
                  color: '#374151', 
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {item.nudge}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Daily Digest Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
          End-of-Day Summary
        </h3>
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '20px',
          lineHeight: '1.6'
        }}>
          Get a personalized AI-generated summary of your day, celebrating your wins and 
          preparing you for tomorrow's success.
        </p>
        
        <button
          onClick={async () => {
            try {
              const response = await TaskService.getDailyDigest();
              toast.success('Daily digest generated! Check your stats page.');
            } catch (error) {
              toast.error('Failed to generate daily digest');
            }
          }}
          className="btn btn-primary"
        >
          <Sparkles size={16} />
          Generate Daily Digest
        </button>
      </motion.div>
    </div>
  );
};

export default NudgeCenter;
