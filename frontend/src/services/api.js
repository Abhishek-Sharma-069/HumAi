import axios from 'axios';
import { auth } from '../firebase';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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