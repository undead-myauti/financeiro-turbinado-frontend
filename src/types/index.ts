export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  token: string;
}

export interface Expense {
  id?: number;
  name: string;
  value: number;
  date: string;
  user: {
    id: number;
  };
}

export interface Category {
  id?: number;
  name: string;
  user: {
    id: number;
  };
}

export interface Income {
  id?: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  user: {
    id: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
} 