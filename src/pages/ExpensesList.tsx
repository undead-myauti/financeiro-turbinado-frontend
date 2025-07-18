import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, DollarSign, Calendar, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/Button';
import { userService, expenseService } from '../services/api';

interface Expense {
  id: number;
  name: string;
  value: number;
  date: string;
  category?: {
    id: number;
    name: string;
  };
  categoryId?: number;
  categoryName?: string;
}

export const ExpensesList: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        const response = await expenseService.list();
        console.log('Resposta da API (despesas):', response);
        setExpenses(response);
      } catch (error: any) {
        console.error('Erro ao carregar despesas:', error);
        toast.error('❌ Erro ao carregar despesas');
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
    
    // Obter nome do usuário
    const currentUser = userService.getCurrentUser();
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      return;
    }

    try {
      await expenseService.delete(id);
      setExpenses(expenses.filter(expense => expense.id !== id));
      toast.success('🗑️ Despesa excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir despesa:', error);
      toast.error('❌ Erro ao excluir despesa');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleLogout = () => {
    userService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando despesas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
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
              <h1 className="text-xl font-bold text-white">
                💸 Lista de Despesas
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/add-expense')}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Despesa</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-300 text-sm">👤</span>
                </div>
                <span className="text-gray-300 text-sm">Olá, <b>{userName}</b></span>
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
              >
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              💸 Suas Despesas
            </h2>
            <p className="text-gray-400">
              Gerencie todas as suas despesas
            </p>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhuma despesa encontrada
              </h3>
              <p className="text-gray-400 mb-6">
                Comece adicionando sua primeira despesa
              </p>
              <Button
                onClick={() => navigate('/add-expense')}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Primeira Despesa</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-red-500 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {expense.name}
                        </h3>
                        <span className="text-red-400 font-bold text-lg">
                          {formatCurrency(expense.value)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(expense.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4" />
                          <span>{expense.category?.name || expense.categoryName || 'Sem categoria'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => navigate(`/edit-expense/${expense.id}`)}
                        variant="secondary"
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Button>
                      
                      <Button
                        onClick={() => handleDelete(expense.id)}
                        variant="secondary"
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}; 