import axios from 'axios';
import type { 
  User, 
  LoginRequest, 
  LoginResponse, 
  Expense, 
  Category, 
  Receipt,
  CreditCard,
  DashboardData,
  UpcomingDue
} from '../types';

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
  
  getById: async (id: number) => {
    const response = await api.get(`/expense/${id}`);
    return response.data;
  },
  
  update: async (id: number, expense: Expense) => {
    const response = await api.put(`/expense/${id}`, expense);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/expense/${id}`);
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
  create: async (receipt: Receipt) => {
    const response = await api.post('/receipt/', receipt);
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/receipt/');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/receipt/${id}`);
    return response.data;
  },
  
  update: async (id: number, receipt: Receipt) => {
    const response = await api.put(`/receipt/${id}`, receipt);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/receipt/${id}`);
    return response.data;
  },
};

export const creditCardService = {
  create: async (creditCard: CreditCard) => {
    const response = await api.post('/credit-cards', creditCard);
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/credit-cards');
    return response.data;
  },
};

export const dashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  
  getUpcomingDue: async (): Promise<UpcomingDue[]> => {
    const response = await api.get('/dashboard/upcoming-due');
    return response.data;
  },
};

export const reportsService = {
  // Relatórios de Receitas
  getIncomeMonthly: async () => {
    const response = await api.get('/dashboard/reports/income/monthly');
    return response.data;
  },
  
  getIncomeByCategory: async () => {
    const response = await api.get('/dashboard/reports/income/category');
    return response.data;
  },
  
  getIncomeTop: async () => {
    const response = await api.get('/dashboard/reports/income/top');
    return response.data;
  },
  
  // Relatórios de Despesas
  getExpenseMonthly: async () => {
    const response = await api.get('/dashboard/reports/expense/monthly');
    return response.data;
  },
  
  getExpenseByCategory: async () => {
    const response = await api.get('/dashboard/reports/expense/category');
    return response.data;
  },
  
  getExpenseTop: async () => {
    const response = await api.get('/dashboard/reports/expense/top');
    return response.data;
  },
  
  // Relatório de Saldo Mensal
  getBalanceMonthly: async () => {
    const response = await api.get('/dashboard/reports/balance/monthly');
    return response.data;
  },
}; 