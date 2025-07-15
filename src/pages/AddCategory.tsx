import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { categoryService, userService } from '../services/api';

interface CategoryFormData {
  name: string;
}

export const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da categoria é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
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

      const categoryData = {
        name: formData.name.trim(),
        user: {
          id: currentUser.id
        }
      };

      await categoryService.create(categoryData);
      
      toast.success('🏷️ Categoria criada com sucesso!');
      
      // Redirecionar para dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Erro ao criar categoria:', error);
      
      if (error.response?.status === 401) {
        toast.error('❌ Sessão expirada. Faça login novamente.');
        setErrors({ submit: 'Sessão expirada. Faça login novamente.' });
      } else if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
        setErrors({ submit: error.response.data.message });
      } else {
        toast.error('❌ Erro ao criar categoria. Tente novamente.');
        setErrors({ submit: 'Erro ao criar categoria. Tente novamente.' });
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
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
                🏷️ Nova Categoria
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              🏷️ Nova Categoria
            </h2>
            <p className="text-gray-400">
              Crie uma nova categoria para organizar suas finanças
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome da Categoria */}
            <Input
              label="📝 Nome da Categoria"
              type="text"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              placeholder="Ex: Alimentação, Transporte, Lazer..."
              required
              error={errors.name}
            />

            {/* Erro geral */}
            {errors.submit && (
              <div className="text-red-500 text-sm text-center">
                {errors.submit}
              </div>
            )}

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Salvando...' : 'Salvar Categoria'}</span>
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