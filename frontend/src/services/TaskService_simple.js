import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class TaskService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getTasks() {
    try {
      const response = await this.api.get('/tasks');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }

  async createTask(taskData) {
    try {
      const response = await this.api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  }

  async completeTask(taskId) {
    try {
      const response = await this.api.post(`/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete task');
    }
  }

  async getNudge(mood = 'neutral') {
    try {
      const response = await this.api.post('/nudge', { mood });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get nudge');
    }
  }

  async getDailyDigest() {
    try {
      const response = await this.api.get('/daily-digest');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get daily digest');
    }
  }

  async getUserStats() {
    try {
      const response = await this.api.get('/user/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user stats');
    }
  }

  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend is not responding');
    }
  }
}

export default new TaskService();
