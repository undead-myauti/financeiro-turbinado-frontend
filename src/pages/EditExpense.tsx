import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { userService, expenseService, categoryService } from '../services/api';

interface ExpenseFormData {
  name: string;
  amount: string;
  date: string;
  category: string;
}

export const EditExpense: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        
        // Carregar categorias
        const categoriesResponse = await categoryService.list();
        setCategories(categoriesResponse);
        
        // Carregar dados da despesa
        if (id) {
          const expenseData = await expenseService.getById(parseInt(id));
          
          setFormData({
            name: expenseData.name,
            amount: formatCurrency((expenseData.value * 100).toString()),
            date: expenseData.date,
            category: expenseData.category?.name || '',
          });
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error);
        
        if (error.response?.status === 404) {
          toast.error('❌ Despesa não encontrada');
          navigate('/dashboard');
          return;
        }
        
        toast.error('❌ Erro ao carregar dados da despesa');
        navigate('/dashboard');
      } finally {
        setIsLoadingData(false);
        setLoadingCategories(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da despesa é obrigatório';
    }

    if (!formData.amount) {
      newErrors.amount = 'Valor é obrigatório';
    } else {
      const numericValue = formData.amount.replace(/\D/g, '');
      const amount = Number(numericValue) / 100;
      
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Valor deve ser um número positivo';
      }
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não encontrado');
      }

      const numericValue = formData.amount.replace(/\D/g, '');
      const amount = Number(numericValue) / 100;

      const selectedCategory = categories.find(cat => cat.name === formData.category);
      
      const expenseData: any = {
        name: formData.name.trim(),
        value: amount,
        date: formData.date,
        categoryId: selectedCategory?.id || 1,
        userId: currentUser.id
      };

      await expenseService.update(parseInt(id!), expenseData);
      
      toast.success('💸 Despesa atualizada com sucesso!');
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Erro ao atualizar despesa:', error);
      
      if (error.response?.status === 401) {
        toast.error('❌ Sessão expirada. Faça login novamente.');
        setErrors({ submit: 'Sessão expirada. Faça login novamente.' });
      } else if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
        setErrors({ submit: error.response.data.message });
      } else {
        toast.error('❌ Erro ao atualizar despesa. Tente novamente.');
        setErrors({ submit: 'Erro ao atualizar despesa. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await expenseService.delete(parseInt(id!));
      toast.success('🗑️ Despesa excluída com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao excluir despesa:', error);
      toast.error('❌ Erro ao excluir despesa. Tente novamente.');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') return '';
    
    const number = Number(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(number);
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    handleInputChange('amount', formatted);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando despesa...</div>
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
                ✏️ Editar Despesa
              </h1>
            </div>
            
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="secondary"
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              ✏️ Editar Despesa
            </h2>
            <p className="text-gray-400">
              Atualize os dados da despesa
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="📝 Nome da Despesa"
              type="text"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              placeholder="Ex: Aluguel, Conta de luz..."
              error={errors.name}
              required
            />

            <Input
              label="💰 Valor"
              type="text"
              value={formData.amount}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              error={errors.amount}
              required
            />

            <Input
              label="📅 Data"
              type="date"
              value={formData.date}
              onChange={(value) => handleInputChange('date', value)}
              error={errors.date}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🏷️ Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 ${
                  errors.category ? 'border-red-500' : 'border-gray-600'
                }`}
                disabled={loadingCategories}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                ) : (
                  <Save className="w-5 h-5 mr-3" />
                )}
                <span>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center"
              >
                <X className="w-5 h-5 mr-3" />
                <span>Cancelar</span>
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-400">
                Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
              >
                {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
              </Button>
              
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 