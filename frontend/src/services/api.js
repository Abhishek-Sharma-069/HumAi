import axios from 'axios';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return Promise.reject(error);
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const healthService = {
  checkSymptoms: async (symptoms) => {
    const response = await api.post('/health/check-symptoms', { symptoms });
    return response.data;
  }
};

export const articleService = {
  getArticles: async () => {
    const response = await api.get('/articles');
    return response.data;
  },
  getArticleById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  }
};

export const chatbotService = {
  sendMessage: async (message) => {
    const response = await api.post('/chatbot/message', { message });
    return response.data;
  }
};

export default api;