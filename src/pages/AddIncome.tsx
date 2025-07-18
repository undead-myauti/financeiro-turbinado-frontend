import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { userService, receiptService, categoryService } from '../services/api';

interface IncomeFormData {
  description: string;
  amount: string;
  date: string;
  category: string;
}

export const AddIncome: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IncomeFormData>({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.list();
        setCategories(response);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategories([
          { id: 1, name: 'Salário' },
          { id: 2, name: 'Freelance' },
          { id: 3, name: 'Investimentos' },
          { id: 4, name: 'Vendas' },
          { id: 5, name: 'Bônus' },
          { id: 6, name: 'Outros' }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
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
      
      const receiptData: any = {
        name: formData.description.trim(),
        value: amount,
        date: formData.date,
        categoryId: selectedCategory?.id || 1,
        userId: currentUser.id
      };

      await receiptService.create(receiptData);

      toast.success('💰 Receita adicionada com sucesso!');

      navigate('/dashboard');

        } catch (error: any) {
      console.error('Erro ao adicionar receita:', error);
      
      if (error.response?.status === 401) {
        toast.error('❌ Sessão expirada. Faça login novamente.');
        setErrors({ submit: 'Sessão expirada. Faça login novamente.' });
      } else if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
        setErrors({ submit: error.response.data.message });
      } else {
        toast.error('❌ Erro ao salvar receita. Tente novamente.');
        setErrors({ submit: 'Erro ao salvar receita. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
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
                💰 Adicionar Receita
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              💸 Nova Receita
            </h2>
            <p className="text-gray-400">
              Registre uma nova entrada de dinheiro
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="📝 Descrição"
              type="text"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              placeholder="Ex: Salário do mês"
              required
              error={errors.description}
            />

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                💵 Valor
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="R$ 0,00"
                required
                className={`
                  w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border transition-all duration-200
                  bg-gray-900 border-gray-700 text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                  ${errors.amount ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                `}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                📅 Data
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                className={`
                  w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border transition-all duration-200
                  bg-gray-900 border-gray-700 text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                  ${errors.date ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                `}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                🏷️ Categoria
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                disabled={loadingCategories}
                className={`
                  w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border transition-all duration-200
                  bg-gray-900 border-gray-700 text-white
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                  ${errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                  ${loadingCategories ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <option value="">
                  {loadingCategories ? 'Carregando categorias...' : 'Selecione uma categoria'}
                </option>
                {categories.length === 0 && !loadingCategories ? (
                  <option value="" disabled>
                    Nenhuma categoria disponível
                  </option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
              {categories.length === 0 && !loadingCategories && (
                <p className="text-yellow-500 text-sm mt-1">
                  ⚠️ Nenhuma categoria encontrada. 
                  <button 
                    type="button"
                    onClick={() => navigate('/add-category')}
                    className="text-blue-400 hover:text-blue-300 underline ml-1"
                  >
                    Criar primeira categoria
                  </button>
                </p>
              )}
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {errors.submit && (
              <div className="text-red-500 text-sm text-center">
                {errors.submit}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Salvando...' : 'Salvar Receita'}</span>
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}; 