import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Calendar, Award, Zap, Clock, CheckCircle } from 'lucide-react';
import TaskService from '../services/TaskService';
import toast from 'react-hot-toast';

const Stats = ({ user }) => {
  const [stats, setStats] = useState({
    streak: user.streak,
    total_points: user.total_points,
    total_tasks: 0,
    completed_tasks: 0,
    completion_rate: 0,
    weekly_tasks: 0,
  });
  const [dailyDigest, setDailyDigest] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await TaskService.getUserStats();
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const generateDailyDigest = async () => {
    try {
      const response = await TaskService.getDailyDigest();
      setDailyDigest(response.digest);
      toast.success('Daily digest generated! 📖');
    } catch (error) {
      toast.error('Failed to generate daily digest');
    }
  };

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your streak today!";
    if (streak < 3) return "Great start! Keep it going!";
    if (streak < 7) return "You're building momentum!";
    if (streak < 14) return "Amazing consistency!";
    if (streak < 30) return "You're on fire! 🔥";
    return "Legendary streak! You're unstoppable! 🏆";
  };

  const getCompletionRateColor = (rate) => {
    if (rate >= 80) return '#10b981';
    if (rate >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-header"
      >
        <h1 className="dashboard-title">Your Progress 📊</h1>
        <p className="dashboard-subtitle">
          Track your journey and celebrate your achievements
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="stats-grid"
        style={{ marginBottom: '32px' }}
      >
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.streak}
          </div>
          <div className="stat-label">Day Streak</div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            {getStreakMessage(stats.streak)}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {stats.total_points}
          </div>
          <div className="stat-label">Total Points</div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            {stats.total_points > 100 ? "Point master!" : "Keep earning!"}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: getCompletionRateColor(stats.completion_rate) }}>
            {Math.round(stats.completion_rate)}%
          </div>
          <div className="stat-label">Completion Rate</div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            {stats.completion_rate >= 80 ? "Excellent!" : "Room to improve!"}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {stats.weekly_tasks}
          </div>
          <div className="stat-label">This Week</div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            {stats.weekly_tasks > 5 ? "Super productive!" : "Keep going!"}
          </div>
        </div>
      </motion.div>

      {/* Detailed Stats */}
      <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
        {/* Task Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
            <Target size={20} style={{ marginRight: '8px' }} />
            Task Overview
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#374151',
                marginBottom: '4px'
              }}>
                {stats.total_tasks}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Tasks</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#10b981',
                marginBottom: '4px'
              }}>
                {stats.completed_tasks}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Completed</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#ef4444',
                marginBottom: '4px'
              }}>
                {stats.total_tasks - stats.completed_tasks}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending</div>
            </div>
          </div>
        </motion.div>

        {/* Progress Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
            <TrendingUp size={20} style={{ marginRight: '8px' }} />
            Progress Visualization
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%',
              background: `conic-gradient(#667eea ${stats.completion_rate * 3.6}deg, #e5e7eb 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600',
                color: '#667eea'
              }}>
                {Math.round(stats.completion_rate)}%
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>Overall Progress</h4>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '16px' }}>
                You've completed {stats.completed_tasks} out of {stats.total_tasks} tasks, 
                maintaining a {Math.round(stats.completion_rate)}% completion rate.
              </p>
              
              {stats.completion_rate >= 80 && (
                <div style={{ 
                  padding: '12px', 
                  background: '#f0fdf4', 
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: '#166534',
                    fontWeight: '500'
                  }}>
                    <Award size={16} />
                    Excellent completion rate! Keep up the great work!
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Digest */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ color: '#1f2937' }}>
            <Calendar size={20} style={{ marginRight: '8px' }} />
            Daily Digest
          </h3>
          <button
            onClick={generateDailyDigest}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            <Zap size={16} />
            Generate
          </button>
        </div>
        
        {dailyDigest ? (
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white',
            lineHeight: '1.6'
          }}>
            <p style={{ fontSize: '16px', fontStyle: 'italic' }}>
              "{dailyDigest}"
            </p>
          </div>
        ) : (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6b7280',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '2px dashed #e2e8f0'
          }}>
            <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No daily digest yet</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Generate your personalized AI summary of the day
            </p>
          </div>
        )}
      </motion.div>

      {/* Achievement Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
          <Award size={20} style={{ marginRight: '8px' }} />
          Achievement Badges
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Streak Badge */}
          <div style={{
            padding: '16px',
            background: stats.streak >= 7 ? '#fef3c7' : '#f3f4f6',
            borderRadius: '12px',
            border: `2px solid ${stats.streak >= 7 ? '#f59e0b' : '#e5e7eb'}`,
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '8px',
              opacity: stats.streak >= 7 ? 1 : 0.5
            }}>
              🔥
            </div>
            <div style={{ 
              fontWeight: '600', 
              color: stats.streak >= 7 ? '#92400e' : '#6b7280',
              marginBottom: '4px'
            }}>
              Streak Master
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {stats.streak >= 7 ? 'Unlocked!' : 'Complete 7 days'}
            </div>
          </div>

          {/* Points Badge */}
          <div style={{
            padding: '16px',
            background: stats.total_points >= 100 ? '#dbeafe' : '#f3f4f6',
            borderRadius: '12px',
            border: `2px solid ${stats.total_points >= 100 ? '#3b82f6' : '#e5e7eb'}`,
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '8px',
              opacity: stats.total_points >= 100 ? 1 : 0.5
            }}>
              ⭐
            </div>
            <div style={{ 
              fontWeight: '600', 
              color: stats.total_points >= 100 ? '#1e40af' : '#6b7280',
              marginBottom: '4px'
            }}>
              Point Collector
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {stats.total_points >= 100 ? 'Unlocked!' : 'Earn 100 points'}
            </div>
          </div>

          {/* Completion Badge */}
          <div style={{
            padding: '16px',
            background: stats.completion_rate >= 80 ? '#dcfce7' : '#f3f4f6',
            borderRadius: '12px',
            border: `2px solid ${stats.completion_rate >= 80 ? '#22c55e' : '#e5e7eb'}`,
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '8px',
              opacity: stats.completion_rate >= 80 ? 1 : 0.5
            }}>
              🎯
            </div>
            <div style={{ 
              fontWeight: '600', 
              color: stats.completion_rate >= 80 ? '#166534' : '#6b7280',
              marginBottom: '4px'
            }}>
              Task Master
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {stats.completion_rate >= 80 ? 'Unlocked!' : '80% completion rate'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;
