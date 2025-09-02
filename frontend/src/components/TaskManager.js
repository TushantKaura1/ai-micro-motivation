import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle, Circle, AlertCircle, Target } from 'lucide-react';
import TaskService from '../services/TaskService';
import toast from 'react-hot-toast';

const TaskManager = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimated_duration: 30,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await TaskService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      const taskData = await TaskService.createTask(newTask);
      setTasks(prev => [taskData, ...prev]);
      setNewTask({ title: '', description: '', priority: 'medium', estimated_duration: 30 });
      setShowAddForm(false);
      toast.success('Task added successfully! 🎯');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await TaskService.completeTask(taskId);
      
      setTasks(prev => prev.map(task => 
        task.task_id === taskId 
          ? { ...task, status: 'completed', completed_at: new Date().toISOString() }
          : task
      ));
      
      toast.success(`Task completed! +${response.points_earned} points 🎉`);
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle size={16} style={{ color: '#ef4444' }} />;
      case 'medium': return <Target size={16} style={{ color: '#f59e0b' }} />;
      case 'low': return <Circle size={16} style={{ color: '#10b981' }} />;
      default: return <Circle size={16} style={{ color: '#6b7280' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your tasks...</p>
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
        <h1 className="dashboard-title">Task Manager 📋</h1>
        <p className="dashboard-subtitle">
          Break down your goals into manageable micro-steps
        </p>
      </motion.div>

      {/* Add Task Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '24px', textAlign: 'center' }}
      >
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          {showAddForm ? 'Cancel' : 'Add New Task'}
        </button>
      </motion.div>

      {/* Add Task Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
          style={{ marginBottom: '24px' }}
        >
          <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>Create New Task</h3>
          <form onSubmit={handleAddTask}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="input"
                placeholder="What do you want to accomplish?"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Description (Optional)</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="input"
                placeholder="Add more details about this task..."
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input
                  type="number"
                  value={newTask.estimated_duration}
                  onChange={(e) => setNewTask({ ...newTask, estimated_duration: parseInt(e.target.value) })}
                  className="input"
                  min="5"
                  max="480"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Task
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tasks List */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Pending Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
            Pending Tasks ({pendingTasks.length})
          </h3>
          
          {pendingTasks.length > 0 ? (
            <div className="task-list">
              {pendingTasks.map((task, index) => (
                <motion.div
                  key={task.task_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`task-item ${task.priority}-priority`}
                >
                  <div className="task-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getPriorityIcon(task.priority)}
                      <div className="task-title">{task.title}</div>
                    </div>
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
                      <CheckCircle size={14} style={{ marginRight: '4px' }} />
                      Complete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <Target size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No pending tasks!</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Add a new task to get started
              </p>
            </div>
          )}
        </motion.div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
              Completed Today ({completedTasks.length})
            </h3>
            
            <div className="task-list">
              {completedTasks.map((task, index) => (
                <motion.div
                  key={task.task_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="task-item"
                  style={{ 
                    opacity: 0.7, 
                    borderLeft: '4px solid #10b981',
                    background: '#f0fdf4'
                  }}
                >
                  <div className="task-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={16} style={{ color: '#10b981' }} />
                      <div className="task-title" style={{ textDecoration: 'line-through' }}>
                        {task.title}
                      </div>
                    </div>
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      background: '#dcfce7', 
                      color: '#166534',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Completed
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
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#10b981',
                      fontWeight: '500'
                    }}>
                      +{task.points_value || 10} points
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
