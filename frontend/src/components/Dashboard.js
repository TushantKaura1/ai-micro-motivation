import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Zap, TrendingUp, Calendar, Clock } from 'lucide-react';
import TaskService from '../services/TaskService';
import toast from 'react-hot-toast';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    streak: user.streak,
    total_points: user.total_points,
    total_tasks: 0,
    completed_tasks: 0,
    completion_rate: 0,
    weekly_tasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, tasksData] = await Promise.all([
        TaskService.getUserStats(),
        TaskService.getTasks(),
      ]);
      
      setStats(statsData);
      setTasks(tasksData.slice(0, 3)); // Show only first 3 tasks
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await TaskService.completeTask(taskId);
      
      // Show celebration
      setCelebrationMessage(response.celebration);
      setShowCelebration(true);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total_points: prev.total_points + response.points_earned,
        completed_tasks: prev.completed_tasks + 1,
      }));
      
      // Remove completed task from list
      setTasks(prev => prev.filter(task => task.task_id !== taskId));
      
      toast.success(`+${response.points_earned} points earned! 🎉`);
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Celebration Modal */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="celebration"
        >
          <h3>🎉 Amazing Work!</h3>
          <p>{celebrationMessage}</p>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-header"
      >
        <h1 className="dashboard-title">
          {getGreeting()}, {user.name}! 👋
        </h1>
        <p className="dashboard-subtitle">
          Ready to tackle your micro-steps today?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="stats-grid"
      >
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.streak}
          </div>
          <div className="stat-label">Day Streak</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {stats.total_points}
          </div>
          <div className="stat-label">Total Points</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {Math.round(stats.completion_rate)}%
          </div>
          <div className="stat-label">Completion Rate</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {stats.weekly_tasks}
          </div>
          <div className="stat-label">This Week</div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="dashboard-card"
        >
          <div className="card-header">
            <h3 className="card-title">
              <Target size={20} style={{ marginRight: '8px' }} />
              Today's Focus
            </h3>
            <button className="btn btn-primary">
              <Plus size={16} />
              Add Task
            </button>
          </div>
          
          {tasks.length > 0 ? (
            <div className="task-list">
              {tasks.map((task) => (
                <motion.div
                  key={task.task_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`task-item ${task.priority}-priority`}
                >
                  <div className="task-header">
                    <div className="task-title">{task.title}</div>
                    <div className={`task-priority ${task.priority}`}>
                      {task.priority}
                    </div>
                  </div>
                  
                  {task.description && (
                    <div className="task-description">{task.description}</div>
                  )}
                  
                  <div className="task-footer">
                    <div className="task-duration">
                      <Clock size={14} style={{ marginRight: '4px' }} />
                      {task.estimated_duration} min
                    </div>
                    <button
                      onClick={() => handleCompleteTask(task.task_id)}
                      className="btn btn-success"
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Complete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <Target size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No tasks for today yet!</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Add your first task to get started
              </p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="dashboard-card"
        >
          <h3 className="card-title">
            <Zap size={20} style={{ marginRight: '8px' }} />
            Quick Actions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button className="btn btn-secondary w-full">
              <Zap size={16} />
              Get Motivation Nudge
            </button>
            
            <button className="btn btn-secondary w-full">
              <TrendingUp size={16} />
              View Daily Digest
            </button>
            
            <button className="btn btn-secondary w-full">
              <Calendar size={16} />
              Plan Tomorrow
            </button>
          </div>
          
          {/* Progress Ring */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%',
              background: `conic-gradient(#667eea ${stats.completion_rate * 3.6}deg, #e5e7eb 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
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
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Today's Progress
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
