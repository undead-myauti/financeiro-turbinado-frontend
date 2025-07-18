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
      return 'R$ 0,00';
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-white text-lg">Carregando dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="glass border-b border-gray-700/50 shadow-lg flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💰</span>
                  </div>
                  <h1 className="text-xl font-bold gradient-text">
                    Financeiro Turbinado
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 glass rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-gray-300 text-sm">Olá, <b>{userName}</b></span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo principal - Estado de erro */}
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl p-8 md:p-12 shadow-2xl text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Erro de Conexão
              </h2>
              
              <p className="text-red-400 text-lg mb-8 max-w-2xl mx-auto">
                {error}
              </p>

              <div className="card-modern rounded-lg p-6 mb-8 text-left">
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
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <span>🔄 Recarregar Página</span>
                </Button>
                
                <Button 
                  onClick={handleLogout}
                  variant="secondary"
                  size="lg"
                  className="flex items-center space-x-2"
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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-gray-700/50 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💰</span>
                </div>
                <h1 className="text-xl font-bold gradient-text">
                  Financeiro Turbinado
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 glass rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-gray-300 text-sm">Olá, <b>{userName}</b></span>
              </div>
              <Button
                onClick={handleLogout}
                variant="danger"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quadrado central com informações gerais */}
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                  Resumo Financeiro
                </h2>
                <p className="text-gray-400">
                  🎯 Visão geral das suas finanças
                </p>
              </div>

              {/* Grid de informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Saldo Atual */}
                <div className="card-modern rounded-xl p-6 border border-green-500/20 hover:border-green-500/40">
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
                <div className="card-modern rounded-xl p-6 border border-green-500/20 hover:border-green-500/40">
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
                <div className="card-modern rounded-xl p-6 border border-red-500/20 hover:border-red-500/40">
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
                <div className="card-modern rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40">
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
                <div className="card-modern rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm font-medium">💳 Cartões Ativos</h3>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData.activeCreditCards || 0}
                  </p>
                  <div className="mt-2 flex items-center text-purple-500 text-sm">
                    <span>💳 Cartões cadastrados</span>
                  </div>
                </div>

                {/* Próximos Vencimentos */}
                <div className="card-modern rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-300 text-sm font-medium">⏰ Próximos Vencimentos</h3>
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData.upcomingDueDates || 0}
                  </p>
                  <div className="mt-2 flex items-center text-orange-500 text-sm">
                    <span>📅 Próximos 30 dias</span>
                  </div>
                </div>
              </div>

              {/* Ações rápidas */}
              <div className="mt-6 pt-6 border-t border-gray-600/50">
                <h3 className="text-lg font-semibold text-white mb-4">⚡ Ações Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => navigate('/add-income')}
                    className="w-full"
                  >
                    💰 Adicionar Receita
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-expense')}
                    className="w-full"
                  >
                    💸 Adicionar Despesa
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-category')}
                    className="w-full"
                  >
                    🏷️ Nova Categoria
                  </Button>
                  <Button 
                    onClick={() => navigate('/add-credit-card')}
                    className="w-full"
                  >
                    💳 Novo Cartão
                  </Button>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => navigate('/receipts')}
                    variant="secondary"
                    className="w-full"
                  >
                    📋 Ver Receitas
                  </Button>
                  <Button 
                    onClick={() => navigate('/expenses')}
                    variant="secondary"
                    className="w-full"
                  >
                    📋 Ver Despesas
                  </Button>
                  <Button 
                    onClick={() => navigate('/reports')}
                    variant="secondary"
                    className="w-full"
                  >
                    📊 Ver Relatórios
                  </Button>
                </div>
              </div>

              {/* Seção de boas-vindas quando não há dados */}
              {!hasData && (
                <div className="mt-8 pt-8 border-t border-gray-600/50">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Bem-vindo ao Financeiro Turbinado!
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                      Parece que você ainda não tem dados financeiros registrados. 
                      Comece adicionando suas primeiras receitas e despesas para ver 
                      seu dashboard completo!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="card-modern rounded-lg p-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h4 className="text-white font-semibold mb-1 text-sm">💰 Adicionar Receita</h4>
                        <p className="text-gray-400 text-xs">
                          Registre seus ganhos
                        </p>
                      </div>

                      <div className="card-modern rounded-lg p-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        </div>
                        <h4 className="text-white font-semibold mb-1 text-sm">💸 Adicionar Despesa</h4>
                        <p className="text-gray-400 text-xs">
                          Registre seus gastos
                        </p>
                      </div>

                      <div className="card-modern rounded-lg p-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <BarChart3 className="w-5 h-5 text-purple-500" />
                        </div>
                        <h4 className="text-white font-semibold mb-1 text-sm">📊 Ver Relatórios</h4>
                        <p className="text-gray-400 text-xs">
                          Visualize gráficos
                        </p>
                      </div>

                      <div className="card-modern rounded-lg p-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CreditCard className="w-5 h-5 text-blue-500" />
                        </div>
                        <h4 className="text-white font-semibold mb-1 text-sm">💳 Adicionar Cartão</h4>
                        <p className="text-gray-400 text-xs">
                          Cadastre cartões
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={() => navigate('/add-income')}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>Começar com Receita</span>
                      </Button>
                      
                      <Button 
                        onClick={() => navigate('/add-expense')}
                        variant="secondary"
                        className="flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>Começar com Despesa</span>
                      </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-600/50">
                      <p className="text-gray-500 text-sm mb-4">
                        💡 Dica: Comece criando algumas categorias e cartões para organizar melhor suas finanças!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button 
                          onClick={() => navigate('/add-category')}
                          variant="secondary"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <span>Criar Primeira Categoria</span>
                        </Button>
                        <Button 
                          onClick={() => navigate('/add-credit-card')}
                          variant="secondary"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          <span>Adicionar Cartão</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 