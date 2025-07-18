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

export interface Category {
  id?: number;
  name: string;
  user: {
    id: number;
  };
}

export interface Expense {
  id?: number;
  name: string;
  value: number;
  date: string;
  category: {
    id: number;
  };
  user: {
    id: number;
  };
}

export interface Receipt {
  id?: number;
  name: string;
  value: number;
  date: string;
  category: {
    id: number;
  };
  user: {
    id: number;
  };
}

export interface CreditCard {
  id?: number;
  name: string;
  limit: number;
  dueDay: number;
  user: {
    id: number;
  };
}

export interface DashboardData {
  currentBalance: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthBalance: number;
  activeCreditCards: number;
  upcomingDueDates: number;
  incomeGrowthPercentage?: number;
  expenseGrowthPercentage?: number;
  balanceGrowthPercentage?: number;
}

export interface MonthlyReport {
  mes: string;
  valor: number;
}

export interface CategoryReport {
  categoria: string;
  valor: number;
  cor: string;
}

export interface TopItem {
  descricao: string;
  valor: number;
  data: string;
}

export interface ReportsData {
  receitasPorMes: MonthlyReport[];
  despesasPorMes: MonthlyReport[];
  receitasPorCategoria: CategoryReport[];
  despesasPorCategoria: CategoryReport[];
  saldoMensal: MonthlyReport[];
  topDespesas: TopItem[];
  topReceitas: TopItem[];
}

export interface UpcomingDue {
  id: number;
  name: string;
  value: number;
  date: string;
  category: {
    id: number;
    name: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
} 