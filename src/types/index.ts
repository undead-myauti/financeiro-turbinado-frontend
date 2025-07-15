export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
} 