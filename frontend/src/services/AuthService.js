import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(userData) {
    try {
      const response = await this.api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async login(credentials) {
    try {
      const response = await this.api.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Decode token to get user info (in a real app, you'd verify this with the server)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        user_id: payload.user_id,
        email: payload.email,
        name: payload.name,
        streak: payload.streak || 0,
        total_points: payload.total_points || 0,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

export default new AuthService();
