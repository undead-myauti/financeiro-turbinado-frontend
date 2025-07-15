import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';
import { Button } from '../components/Button';
import { userService } from '../services/api';

interface DashboardData {
  saldoAtual: number;
  receitasMes: number;
  despesasMes: number;
  saldoMes: number;
  totalCartoes: number;
  proximosVencimentos: number;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    saldoAtual: 0,
    receitasMes: 0,
    despesasMes: 0,
    saldoMes: 0,
    totalCartoes: 0,
    proximosVencimentos: 0,
  });

  useEffect(() => {
    // Simular dados do dashboard (em um projeto real, viriam da API)
    setDashboardData({
      saldoAtual: 15420.50,
      receitasMes: 8500.00,
      despesasMes: 3200.00,
      saldoMes: 5300.00,
      totalCartoes: 3,
      proximosVencimentos: 2,
    });
    
    // Obter nome do usuário do localStorage
    const currentUser = userService.getCurrentUser();
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name);
    }
  }, []);

  const handleLogout = () => {
    userService.logout();
    navigate('/login');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col overflow-hidden">
      {/* Header logo abaixo da barra do browser */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💰</span>
                </div>
                <h1 className="text-xl font-bold text-white">
                  Financeiro Turbinado
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-gray-300 text-sm">Olá, <b>{userName}</b></span>
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Quadrado central com informações gerais */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  📊 Resumo Financeiro
                </h2>
                <p className="text-gray-400">
                  🎯 Visão geral das suas finanças
                </p>
              </div>

              {/* Grid de informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Saldo Atual */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm font-medium">💵 Saldo Atual</h3>
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(dashboardData.saldoAtual)}
                  </p>
                  <div className="mt-2 flex items-center text-green-500 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>📈 +12.5% este mês</span>
                  </div>
                </div>

                {/* Receitas do Mês */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm font-medium">💸 Receitas do Mês</h3>
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(dashboardData.receitasMes)}
                  </p>
                  <div className="mt-2 flex items-center text-green-500 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>🚀 +8.2% vs mês anterior</span>
                  </div>
                </div>

                {/* Despesas do Mês */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm font-medium">💳 Despesas do Mês</h3>
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(dashboardData.despesasMes)}
                  </p>
                  <div className="mt-2 flex items-center text-red-500 text-sm">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span>📉 -5.1% vs mês anterior</span>
                  </div>
                </div>

                {/* Saldo do Mês */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm font-medium">🏦 Saldo do Mês</h3>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(dashboardData.saldoMes)}
                  </p>
                  <div className="mt-2 flex items-center text-blue-500 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>💎 +65.8% vs mês anterior</span>
                  </div>
                </div>

                {/* Total de Cartões */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm font-medium">💳 Cartões Ativos</h3>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData.totalCartoes}
                  </p>
                  <div className="mt-2 flex items-center text-purple-500 text-sm">
                    <span>💳 Limite total: R$ 25.000,00</span>
                  </div>
                </div>

                {/* Próximos Vencimentos */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm font-medium">⏰ Próximos Vencimentos</h3>
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData.proximosVencimentos}
                  </p>
                  <div className="mt-2 flex items-center text-orange-500 text-sm">
                    <span>📅 Próximo: 15/12/2024</span>
                  </div>
                </div>
              </div>

              {/* Ações rápidas */}
              <div className="mt-6 pt-6 border-t border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">⚡ Ações Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => navigate('/add-income')}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    💰 Adicionar Receita
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-category')}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    🏷️ Nova Categoria
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-expense')}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    💸 Adicionar Despesa
                  </Button>
                  <Button 
                    onClick={() => navigate('/reports')}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    📊 Ver Relatórios
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 