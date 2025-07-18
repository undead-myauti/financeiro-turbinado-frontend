import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Plus, BarChart3 } from 'lucide-react';
import { Button } from '../components/Button';
import { userService, dashboardService } from '../services/api';
import type { DashboardData } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    currentBalance: 0,
    currentMonthIncome: 0,
    currentMonthExpense: 0,
    currentMonthBalance: 0,
    activeCreditCards: 0,
    upcomingDueDates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboard();
        setDashboardData(data);
        
        // Verificar se há dados financeiros
        const hasFinancialData = data.currentMonthIncome > 0 || data.currentMonthExpense > 0 || data.currentBalance !== 0;
        setHasData(hasFinancialData);
      } catch (err: any) {
        console.error('Erro ao carregar dados do dashboard:', err);
        
        // Tratamento específico de erros
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else if (err.response?.status === 404) {
          setError('API não encontrada. Verifique se a API Java está rodando.');
        } else if (err.code === 'ECONNREFUSED') {
          setError('Não foi possível conectar com a API. Verifique se a API Java está rodando na porta 8000.');
        } else if (err.message?.includes('Network Error')) {
          setError('Erro de conexão. Verifique se a API Java está rodando.');
        } else {
          setError('Erro ao carregar dados do dashboard. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
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
    if (isNaN(value) || value === null || value === undefined) {
      return 'Nenhum dado';
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gray-900 flex flex-col overflow-hidden">
        {/* Header */}
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

        {/* Conteúdo principal - Estado de erro */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-gray-800 rounded-xl p-8 md:p-12 shadow-2xl border border-gray-700 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Erro de Conexão
              </h2>
              
              <p className="text-red-400 text-lg mb-8 max-w-2xl mx-auto">
                {error}
              </p>

              <div className="bg-gray-700 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-white font-semibold mb-4">🔧 Como resolver:</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Verifique se a API Java está rodando na porta 8000</li>
                  <li>• Certifique-se de que o banco PostgreSQL está ativo</li>
                  <li>• Verifique se não há erros na API Java</li>
                  <li>• Tente recarregar a página</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <span>🔄 Recarregar Página</span>
                </Button>
                
                <Button 
                  onClick={handleLogout}
                  variant="secondary"
                  className="flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Fazer Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Estado para quando não há dados financeiros
  if (!hasData) {
    return (
      <div className="w-full h-full bg-gray-900 flex flex-col overflow-hidden">
        {/* Header */}
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

        {/* Conteúdo principal - Estado vazio */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-gray-800 rounded-xl p-8 md:p-12 shadow-2xl border border-gray-700 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
                <span className="text-4xl">💰</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Bem-vindo ao Financeiro Turbinado!
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Parece que você ainda não tem dados financeiros registrados. 
                Comece adicionando suas primeiras receitas e despesas para ver 
                seu dashboard completo!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">💰 Adicionar Receita</h3>
                  <p className="text-gray-400 text-sm">
                    Registre seus ganhos e entradas de dinheiro
                  </p>
                </div>

                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">💸 Adicionar Despesa</h3>
                  <p className="text-gray-400 text-sm">
                    Registre seus gastos e saídas de dinheiro
                  </p>
                </div>

                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">📊 Ver Relatórios</h3>
                  <p className="text-gray-400 text-sm">
                    Visualize gráficos e estatísticas
                  </p>
                </div>

                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">💳 Adicionar Cartão</h3>
                  <p className="text-gray-400 text-sm">
                    Cadastre seus cartões de crédito
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/add-income')}
                  className="flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Começar com Receita</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/add-expense')}
                  variant="secondary"
                  className="flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Começar com Despesa</span>
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-600">
                <p className="text-gray-500 text-sm">
                  💡 Dica: Comece criando algumas categorias e cartões para organizar melhor suas finanças!
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => navigate('/add-category')}
                    variant="secondary"
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Primeira Categoria</span>
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-credit-card')}
                    variant="secondary"
                    className="flex items-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Adicionar Cartão</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                    {formatCurrency(dashboardData.currentBalance)}
                  </p>
                  <div className="mt-2 flex items-center text-green-500 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>📈 Dados em tempo real</span>
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
                    {formatCurrency(dashboardData.currentMonthIncome)}
                  </p>
                  <div className="mt-2 flex items-center text-green-500 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>🚀 Dados atualizados</span>
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
                    {formatCurrency(dashboardData.currentMonthExpense)}
                  </p>
                  <div className="mt-2 flex items-center text-red-500 text-sm">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span>📉 Dados em tempo real</span>
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
                    {formatCurrency(dashboardData.currentMonthBalance)}
                  </p>
                  <div className="mt-2 flex items-center text-blue-500 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>💎 Dados atualizados</span>
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
                    {isNaN(dashboardData.activeCreditCards) || dashboardData.activeCreditCards === null || dashboardData.activeCreditCards === undefined 
                      ? 'Nenhum cartão' 
                      : dashboardData.activeCreditCards}
                  </p>
                  <div className="mt-2 flex items-center text-purple-500 text-sm">
                    <span>💳 Cartões cadastrados</span>
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
                    {isNaN(dashboardData.upcomingDueDates) || dashboardData.upcomingDueDates === null || dashboardData.upcomingDueDates === undefined 
                      ? 'Nenhum vencimento' 
                      : dashboardData.upcomingDueDates}
                  </p>
                  <div className="mt-2 flex items-center text-orange-500 text-sm">
                    <span>📅 Próximos 30 dias</span>
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
                    onClick={() => navigate('/add-expense')}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    💸 Adicionar Despesa
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-category')}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    🏷️ Nova Categoria
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-credit-card')}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    💳 Novo Cartão
                  </Button>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => navigate('/receipts')}
                    variant="secondary"
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    📋 Ver Receitas
                  </Button>
                  <Button 
                    onClick={() => navigate('/expenses')}
                    variant="secondary"
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    📋 Ver Despesas
                  </Button>
                  <Button 
                    onClick={() => navigate('/reports')}
                    variant="secondary"
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