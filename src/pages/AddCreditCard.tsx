import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Save, X } from 'lucide-react';
import { creditCardService, userService } from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const AddCreditCard: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    dueDay: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não encontrado');
      }
      
      const creditCardData = {
        name: formData.name.trim(),
        limit: parseFloat(formData.limit.replace(/\D/g, '')) / 100,
        dueDay: parseInt(formData.dueDay),
        user: {
          id: currentUser.id
        }
      };

      // Validações
      if (!creditCardData.name) {
        throw new Error('Nome do cartão é obrigatório');
      }

      if (!creditCardData.limit || creditCardData.limit <= 0) {
        throw new Error('Limite deve ser maior que zero');
      }

      if (!creditCardData.dueDay || creditCardData.dueDay < 1 || creditCardData.dueDay > 31) {
        throw new Error('Dia de vencimento deve estar entre 1 e 31');
      }

      await creditCardService.create(creditCardData);
      
      alert('Cartão de crédito adicionado com sucesso!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro ao adicionar cartão:', err);
      
      if (err.response?.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
        navigate('/login');
        return;
      }
      
      if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Dados inválidos. Verifique os campos.');
      } else if (err.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erro ao adicionar cartão. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
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
                💳 Novo Cartão de Crédito
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              💳 Novo Cartão de Crédito
            </h2>
            <p className="text-gray-400">
              Cadastre um novo cartão de crédito
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="📝 Nome do Cartão"
              type="text"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              placeholder="Ex: Nubank, Itaú, etc."
              required
            />

            <Input
              label="💰 Limite do Cartão"
              type="text"
              value={formData.limit}
              onChange={(value) => {
                const formattedValue = formatCurrency(value);
                setFormData(prev => ({ ...prev, limit: formattedValue }));
              }}
              placeholder="0,00"
              required
            />
            <p className="text-gray-400 text-sm -mt-4">
              💡 Digite apenas números (ex: 5000,00)
            </p>

            <Input
              label="📅 Dia de Vencimento"
              type="number"
              value={formData.dueDay}
              onChange={(value) => setFormData(prev => ({ ...prev, dueDay: value }))}
              placeholder="Ex: 15"
              required
            />
            <p className="text-gray-400 text-sm -mt-4">
              💡 Dia do mês em que vence a fatura (1-31)
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-3" />
                <span>{loading ? 'Adicionando...' : 'Adicionar Cartão'}</span>
              </Button>
              
              <Button
                type="button"
                onClick={() => navigate('/dashboard')}
                variant="secondary"
                className="flex-1 flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-3" />
                <span>Cancelar</span>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddCreditCard; 