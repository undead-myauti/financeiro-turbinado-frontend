import axios from 'axios';
import type { User, LoginRequest, LoginResponse, Expense, Category, Income } from '../types';

const API_BASE_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  create: async (user: User) => {
    const response = await api.post('/user/', user);
    return response.data;
  },
  
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/user/login', credentials);
    const data = response.data;
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email
      }));
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  list: async () => {
    const response = await api.get('/user/');
    return response.data;
  },
};

export const expenseService = {
  create: async (expense: Expense) => {
    const response = await api.post('/expense/', expense);
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/expense/');
    return response.data;
  },
};

export const categoryService = {
  create: async (category: Category) => {
    const response = await api.post('/category/', category);
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/category/');
    return response.data;
  },
};

export const receiptService = {
  create: async (receipt: any) => {
    const response = await api.post('/receipt/', receipt);
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/receipt/');
    return response.data;
  },
}; 