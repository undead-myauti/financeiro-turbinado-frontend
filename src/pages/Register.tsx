import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserPlus } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { userService } from '../services/api';
import type { User as UserType } from '../types';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const userData: UserType = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      await userService.create(userData);
      
      setSuccessMessage('Usuário cadastrado com sucesso!');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      setErrors({ submit: 'Erro ao cadastrar usuário. Tente novamente.' });
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
    <div className="h-full bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-600 rounded-full mb-4">
              <UserPlus className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-lg md:text-2xl font-bold text-white mb-2">
              Financeiro Turbinado
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Crie sua conta para começar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <Input
              label="Nome completo"
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              placeholder="Digite seu nome completo"
              required
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="seu@email.com"
              required
              error={errors.email}
            />

            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Digite sua senha"
              required
              error={errors.password}
            />

            <Input
              label="Confirmar senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirme sua senha"
              required
              error={errors.confirmPassword}
            />

            {errors.submit && (
              <div className="text-red-500 text-sm text-center">
                {errors.submit}
              </div>
            )}

            {successMessage && (
              <div className="text-green-500 text-sm text-center">
                {successMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Cadastrando...' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-4 md:mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-green-500 hover:text-green-400 font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 