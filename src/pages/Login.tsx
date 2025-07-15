import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { userService } from '../services/api';
import type { LoginRequest } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
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
      const credentials: LoginRequest = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await userService.login(credentials);
      
      console.log('Login realizado com sucesso:', response.message);
      
      // Redirecionar para dashboard ou página principal
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      if (error.response?.status === 401) {
        setErrors({ submit: 'Email ou senha incorretos.' });
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Erro ao conectar com o servidor. Verifique se a API está rodando.' });
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-full bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-600 rounded-full mb-4">
              <LogIn className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-lg md:text-2xl font-bold text-white mb-2">
              Financeiro Turbinado
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Faça login para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              placeholder="seu@email.com"
              required
              error={errors.email}
            />

            <div className="mb-3 md:mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Senha
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className={`
                    w-full px-3 py-2 md:px-4 md:py-3 pr-12 rounded-lg border transition-all duration-200
                    bg-gray-900 border-gray-700 text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                  `}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {errors.submit && (
              <div className="text-red-500 text-sm text-center">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 md:mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-green-500 hover:text-green-400 font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 