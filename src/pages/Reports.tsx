import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '../components/Button';
import { userService, reportsService } from '../services/api';
import type { ReportsData } from '../types';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'receitas' | 'despesas' | 'categorias'>('overview');
  const [reportData, setReportData] = useState<ReportsData>({
    receitasPorMes: [],
    despesasPorMes: [],
    receitasPorCategoria: [],
    despesasPorCategoria: [],
    saldoMensal: [],
    topDespesas: [],
    topReceitas: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [hasPartialData, setHasPartialData] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Hook para detectar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        
        // Carregar relatórios individualmente para tratar erros específicos
        const reportData = {
          receitasPorMes: [],
          despesasPorMes: [],
          receitasPorCategoria: [],
          despesasPorCategoria: [],
          saldoMensal: [],
          topDespesas: [],
          topReceitas: [],
        };

        // Função para carregar um relatório com tratamento de erro individual
        const loadReport = async (endpoint: string, key: keyof typeof reportData) => {
          try {
            let response;
            switch (key) {
              case 'receitasPorMes':
                response = await reportsService.getIncomeMonthly();
                break;
              case 'despesasPorMes':
                response = await reportsService.getExpenseMonthly();
                break;
              case 'receitasPorCategoria':
                response = await reportsService.getIncomeByCategory();
                break;
              case 'despesasPorCategoria':
                response = await reportsService.getExpenseByCategory();
                break;
              case 'saldoMensal':
                response = await reportsService.getBalanceMonthly();
                break;
              case 'topDespesas':
                response = await reportsService.getExpenseTop();
                break;
              case 'topReceitas':
                response = await reportsService.getIncomeTop();
                break;
              default:
                response = [];
            }
            

            
            // Extrair os dados do objeto retornado pela API
            let processedData = [];
            if (response && typeof response === 'object') {
              if (response.data && Array.isArray(response.data)) {
                processedData = response.data;
              } else if (Array.isArray(response)) {
                processedData = response;
              }
            }
            
            // Log para debug
            if (key === 'receitasPorCategoria') {
              console.log('Response original receitasPorCategoria:', response);
              console.log('Processed data receitasPorCategoria:', processedData);
            }
            

            

            

            
            // Mapear os dados para o formato esperado pelo frontend
            const mappedData = processedData.map((item: any) => {
              
              // Log para debug
              if (key === 'receitasPorCategoria') {
                console.log('Item original receitasPorCategoria:', item);
              }
              
              // Mapear campos da API para o formato esperado pelo frontend
              if (item.month && item.value !== undefined) {
                return { mes: item.month, valor: item.value };
              } else if (item.category && item.value !== undefined) {
                return { categoria: item.category, valor: item.value, cor: item.color || '#3b82f6' };
              } else if (item.categoryName && item.value !== undefined) {
                return { categoria: item.categoryName, valor: item.value, cor: item.color || '#3b82f6' };
              } else if (item.description && item.value !== undefined) {
                return { descricao: item.description, valor: item.value, data: item.date };
              } else if (item.name && item.value !== undefined) {
                return { descricao: item.name, valor: item.value, data: item.date || item.data };
              } else if (item.mes && item.valor !== undefined) {
                return item; // Já está no formato correto
              } else if (item.categoria && item.valor !== undefined) {
                return item; // Já está no formato correto
              } else if (item.descricao && item.valor !== undefined) {
                return item; // Já está no formato correto
              }
              return item; // Manter original se não conseguir mapear
            });
            
            // Log para debug
            if (key === 'receitasPorCategoria') {
              console.log('Dados processados receitasPorCategoria:', processedData);
              console.log('Dados mapeados receitasPorCategoria:', mappedData);
            }
            

            reportData[key] = mappedData;
          } catch (error: any) {
            console.error(`Erro ao carregar ${key}:`, error);
            // Se for erro 500, não falha toda a página, apenas deixa vazio
            if (error.response?.status === 500) {
              console.warn(`Endpoint ${endpoint} retornou erro 500 - pode não estar implementado`);
            }
            reportData[key] = [];
          }
        };

        // Carregar todos os relatórios em paralelo
        await Promise.all([
          loadReport('/dashboard/reports/income/monthly', 'receitasPorMes'),
          loadReport('/dashboard/reports/expense/monthly', 'despesasPorMes'),
          loadReport('/dashboard/reports/income/category', 'receitasPorCategoria'),
          loadReport('/dashboard/reports/expense/category', 'despesasPorCategoria'),
          loadReport('/dashboard/reports/balance/monthly', 'saldoMensal'),
          loadReport('/dashboard/reports/expense/top', 'topDespesas'),
          loadReport('/dashboard/reports/income/top', 'topReceitas'),
        ]);

        setReportData(reportData);
        

        
        // Verificar se há pelo menos alguns dados
        const hasAnyData = Object.values(reportData).some(data => data.length > 0);
        
        // Verificar se TODOS os relatórios têm dados
        const allReportsHaveData = Object.values(reportData).every(data => data.length > 0);
        
        // hasPartialData deve ser true apenas se alguns relatórios têm dados mas outros não
        setHasPartialData(hasAnyData && !allReportsHaveData);
        
        // Se não há nenhum dado, mostrar mensagem específica
        if (!hasAnyData) {
          setError('Relatórios não disponíveis. Os endpoints de relatórios podem não estar implementados na API Java ainda.');
        }
      } catch (err: any) {
        console.error('Erro geral ao carregar relatórios:', err);
        
        // Tratamento específico de erros
        if (err.response?.status === 401) {
          setError('Sessão expirada. Faça login novamente.');
        } else if (err.response?.status === 404) {
          setError('API não encontrada. Verifique se a API Java está rodando.');
        } else if (err.response?.status === 500) {
          setError('Relatórios não implementados. Os endpoints de relatórios podem não estar disponíveis na API Java ainda.');
        } else if (err.response?.status >= 500) {
          setError('Erro do servidor. Os relatórios podem não estar implementados ainda.');
        } else if (err.code === 'ECONNREFUSED') {
          setError('Não foi possível conectar com a API. Verifique se a API Java está rodando na porta 8000.');
        } else if (err.message?.includes('Network Error')) {
          setError('Erro de conexão. Verifique se a API Java está rodando.');
        } else {
          setError('Erro ao carregar dados dos relatórios. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
    
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
    // Verificar se o valor é NaN ou inválido
    if (isNaN(value) || value === null || value === undefined) {
      return 'R$ 0,00';
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getMaxValue = (data: { valor: number }[] | { saldo: number }[]) => {
    if (data.length === 0) return 1;
    
    // Filtrar valores válidos
    const validValues = data
      .map(item => 'valor' in item ? item.valor : item.saldo)
      .filter(value => value !== null && value !== undefined && !isNaN(value) && value > 0);
    
    if (validValues.length === 0) return 1;
    
    return Math.max(...validValues);
  };

  // Função para ordenar meses cronologicamente
  const sortMonthsChronologically = (data: { mes: string; valor: number }[]) => {
    if (data.length === 0) return data;
    
    // Mapeamento de meses para números para ordenação (usando nomes completos)
    const monthOrder = {
      'Janeiro': 1, 'Fevereiro': 2, 'Março': 3, 'Abril': 4,
      'Maio': 5, 'Junho': 6, 'Julho': 7, 'Agosto': 8,
      'Setembro': 9, 'Outubro': 10, 'Novembro': 11, 'Dezembro': 12
    };
    
    // Mapeamento para nomes abreviados
    const monthAbbreviations = {
      'Janeiro': 'Jan', 'Fevereiro': 'Fev', 'Março': 'Mar', 'Abril': 'Abr',
      'Maio': 'Mai', 'Junho': 'Jun', 'Julho': 'Jul', 'Agosto': 'Ago',
      'Setembro': 'Set', 'Outubro': 'Out', 'Novembro': 'Nov', 'Dezembro': 'Dez'
    };
    
    return [...data].sort((a, b) => {
      // Extrair o primeiro mês do label (para casos agrupados como "Janeiro-Março")
      const aMonth = a.mes.split('-')[0].trim();
      const bMonth = b.mes.split('-')[0].trim();
      
      const aOrder = monthOrder[aMonth as keyof typeof monthOrder] || 0;
      const bOrder = monthOrder[bMonth as keyof typeof monthOrder] || 0;
      
      return aOrder - bOrder;
    }).map(item => {
      // Converter nomes completos para abreviados
      const parts = item.mes.split('-');
      const abbreviatedParts = parts.map(part => {
        const month = part.trim();
        return monthAbbreviations[month as keyof typeof monthAbbreviations] || month;
      });
      
      return {
        ...item,
        mes: abbreviatedParts.join('-')
      };
    });
  };

  // Função para agrupar dados baseado no tamanho da tela
  const groupDataByScreenSize = (data: { mes: string; valor: number }[]) => {
    if (data.length === 0) return data;
    
    // Primeiro, ordenar os dados cronologicamente
    const sortedData = sortMonthsChronologically(data);
    
    // Verificar se estamos em uma tela muito pequena (mobile)
    const isSmallScreen = windowWidth < 640;
    const isMediumScreen = windowWidth >= 640 && windowWidth < 1024;
    
    if (!isSmallScreen && !isMediumScreen) {
      return sortedData; // Tela grande, mostrar todos os meses ordenados
    }
    
    // Para telas pequenas, agrupar de 3 em 3 meses
    if (isSmallScreen && sortedData.length > 3) {
      const grouped = [];
      for (let i = 0; i < sortedData.length; i += 3) {
        const group = sortedData.slice(i, i + 3);
        const totalValue = group.reduce((sum, item) => sum + item.valor, 0);
        const firstMonth = group[0].mes;
        const lastMonth = group[group.length - 1].mes;
        const label = group.length === 1 ? firstMonth : `${firstMonth}-${lastMonth}`;
        
        grouped.push({
          mes: label,
          valor: totalValue
        });
      }
      return grouped;
    }
    
    // Para telas médias, agrupar de 2 em 2 meses
    if (isMediumScreen && sortedData.length > 4) {
      const grouped = [];
      for (let i = 0; i < sortedData.length; i += 2) {
        const group = sortedData.slice(i, i + 2);
        const totalValue = group.reduce((sum, item) => sum + item.valor, 0);
        const firstMonth = group[0].mes;
        const lastMonth = group[group.length - 1].mes;
        const label = group.length === 1 ? firstMonth : `${firstMonth}-${lastMonth}`;
        
        grouped.push({
          mes: label,
          valor: totalValue
        });
      }
      return grouped;
    }
    
    return sortedData;
  };

  const renderBarChart = (data: { mes: string; valor: number }[], color: string, title: string) => {
    if (data.length === 0) {
      return (
        <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400">Nenhum dado disponível</p>
          </div>
        </div>
      );
    }
    
    // Agrupar dados baseado no tamanho da tela
    const groupedData = groupDataByScreenSize(data);
    const maxValue = getMaxValue(groupedData);
    const isGrouped = groupedData.length < data.length;
    
    return (
      <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {isGrouped && (
            <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
              📱 Agrupado
            </span>
          )}
        </div>
        <div className="space-y-3">
          {groupedData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 min-w-0">
              <div className="w-12 text-sm text-gray-300 flex-shrink-0 truncate">{item.mes}</div>
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <div 
                    className="h-8 rounded-lg transition-all duration-300 hover:opacity-80 flex items-center justify-center min-w-0"
                    style={{
                      width: `${Math.max((item.valor / maxValue) * 100, 5)}%`,
                      backgroundColor: color,
                    }}
                  >
                    <span className="text-xs font-medium text-white truncate px-1">
                      {formatCurrency(item.valor)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data: { categoria: string; valor: number; cor: string }[], title: string) => {
    if (data.length === 0) {
      return (
        <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400">Nenhum dado disponível</p>
          </div>
        </div>
      );
    }
    
    // Filtrar dados válidos e calcular total
    const validData = data.filter(item => 
      item.valor !== null && 
      item.valor !== undefined && 
      !isNaN(item.valor) && 
      item.valor > 0
    );
    
    if (validData.length === 0) {
      return (
        <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400">Nenhum dado válido</p>
          </div>
        </div>
      );
    }
    
    const total = validData.reduce((sum, item) => sum + item.valor, 0);
    
    return (
      <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="space-y-3">
          {validData.map((item, index) => {
            const percentage = total > 0 ? ((item.valor / total) * 100) : 0;
            return (
              <div key={index} className="flex items-center justify-between min-w-0">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.cor }}
                  />
                  <span className="text-gray-300 text-sm truncate">{item.categoria}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-white font-medium">{formatCurrency(item.valor)}</div>
                  <div className="text-gray-400 text-xs">
                    {isNaN(percentage) ? '0.0%' : percentage.toFixed(1) + '%'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLineChart = (data: { mes: string; valor: number }[], title: string) => {
    if (data.length === 0) {
      return (
        <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-400">Nenhum dado disponível</p>
          </div>
        </div>
      );
    }
    
    // Agrupar dados baseado no tamanho da tela
    const groupedData = groupDataByScreenSize(data);
    const maxValue = getMaxValue(groupedData);
    const isGrouped = groupedData.length < data.length;
    const points = groupedData.map((item, index) => ({
      x: (index / (groupedData.length - 1)) * 100,
      y: 100 - ((item.valor / maxValue) * 100),
      value: item.valor,
      month: item.mes,
    }));

    return (
      <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {isGrouped && (
            <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
              📱 Agrupado
            </span>
          )}
        </div>
        <div className="relative h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ maxWidth: '100%' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {points.length > 1 && (
              <>
                <path
                  d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`}
                  stroke="#10b981"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length - 1].x},100 L ${points[0].x},100 Z`}
                  fill="url(#lineGradient)"
                />
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill="#10b981"
                    className="hover:r-3 transition-all duration-200"
                  />
                ))}
              </>
            )}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 overflow-hidden">
            {groupedData.map((item, index) => (
              <span key={index} className="truncate px-1">{item.mes}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTopList = (data: { descricao: string; valor: number; data: string }[], title: string, icon: React.ReactNode) => {
    if (data.length === 0) {
      return (
        <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400">Nenhum dado disponível</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg min-w-0">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium truncate">{item.descricao}</div>
                  <div className="text-gray-400 text-sm truncate">{item.data}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-white font-bold">{formatCurrency(item.valor)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando relatórios...</div>
      </div>
    );
  }

  if (error && error.includes('não implementados')) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 shadow-lg flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl">📊</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">Relatórios</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
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
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo principal - Relatórios não implementados */}
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-800 rounded-xl p-8 md:p-12 shadow-2xl border border-gray-700 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                <span className="text-4xl">📊</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Relatórios em Desenvolvimento
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Os relatórios detalhados ainda estão sendo implementados na API Java. 
                Por enquanto, você pode usar o dashboard para visualizar seus dados financeiros.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">📊 Dashboard</h3>
                  <p className="text-gray-400 text-sm">
                    Visualize seu saldo, receitas e despesas do mês
                  </p>
                </div>

                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">📈 Relatórios Futuros</h3>
                  <p className="text-gray-400 text-sm">
                    Gráficos detalhados e análises avançadas
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-white font-semibold mb-4">🚀 Funcionalidades Disponíveis:</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• ✅ Dashboard com resumo financeiro</li>
                  <li>• ✅ Adicionar receitas e despesas</li>
                  <li>• ✅ Gerenciar categorias</li>
                  <li>• ✅ Cartões de crédito</li>
                  <li>• ✅ Próximos vencimentos</li>
                  <li>• 📊 Relatórios detalhados (em desenvolvimento)</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <span>📊 Ver Dashboard</span>
                </Button>
                
                <Button 
                  onClick={() => navigate('/add-income')}
                  variant="secondary"
                  className="flex items-center space-x-2 px-8 py-3 text-lg"
                >
                  <span>💰 Adicionar Receita</span>
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-600">
                <p className="text-gray-500 text-sm">
                  💡 Os relatórios serão implementados em breve na API Java!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 shadow-lg flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">Relatórios</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
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
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
                <h1 className="text-xl font-bold text-white">Relatórios</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
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
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Visão Geral</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('receitas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'receitas'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Receitas</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('despesas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'despesas'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4" />
                <span>Despesas</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('categorias')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'categorias'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>Categorias</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasPartialData && !error && (
            <div className="mb-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">ℹ️</span>
                <p className="text-blue-300 text-sm">
                  Alguns relatórios podem não estar disponíveis ainda. Os gráficos vazios indicam que o endpoint correspondente não está implementado ou retornou erro.
                </p>
              </div>
            </div>
          )}

          {windowWidth < 1024 && (
            <div className="mb-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">📱</span>
                <p className="text-green-300 text-sm">
                  <strong>Dica:</strong> Em telas menores, os gráficos de meses são automaticamente agrupados para melhor visualização. 
                  {windowWidth < 640 ? ' Agrupamento de 3 em 3 meses.' : ' Agrupamento de 2 em 2 meses.'}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderBarChart(reportData.receitasPorMes, '#10b981', 'Receitas por Mês')}
              {renderBarChart(reportData.despesasPorMes, '#ef4444', 'Despesas por Mês')}
              {renderLineChart(reportData.saldoMensal, 'Saldo Mensal')}
              {renderTopList(reportData.topReceitas, 'Top Receitas', <TrendingUp className="w-5 h-5 text-green-500" />)}
              {renderTopList(reportData.topDespesas, 'Top Despesas', <TrendingDown className="w-5 h-5 text-red-500" />)}
            </div>
          )}

          {activeTab === 'receitas' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderBarChart(reportData.receitasPorMes, '#10b981', 'Receitas por Mês')}
              {renderPieChart(reportData.receitasPorCategoria, 'Receitas por Categoria')}
              {renderTopList(reportData.topReceitas, 'Top Receitas', <TrendingUp className="w-5 h-5 text-green-500" />)}
            </div>
          )}

          {activeTab === 'despesas' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderBarChart(reportData.despesasPorMes, '#ef4444', 'Despesas por Mês')}
              {renderPieChart(reportData.despesasPorCategoria, 'Despesas por Categoria')}
              {renderTopList(reportData.topDespesas, 'Top Despesas', <TrendingDown className="w-5 h-5 text-red-500" />)}
            </div>
          )}

          {activeTab === 'categorias' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderPieChart(reportData.receitasPorCategoria, 'Receitas por Categoria')}
              {renderPieChart(reportData.despesasPorCategoria, 'Despesas por Categoria')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}; 