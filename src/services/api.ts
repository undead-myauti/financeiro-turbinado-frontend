import axios from 'axios';
import type { User, Expense } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {
  create: async (user: User) => {
    const response = await api.post('/user/', user);
    return response.data;
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