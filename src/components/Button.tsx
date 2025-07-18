import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
  size = 'md',
}) => {
  const baseClasses = 'relative font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg overflow-hidden group';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 md:px-6 md:py-3 text-base',
    lg: 'px-6 py-3 md:px-8 md:py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl hover:shadow-green-500/25',
    secondary: 'glass border border-gray-600/30 hover:border-gray-500/50 text-gray-200 hover:text-white focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl hover:shadow-red-500/25',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white focus:ring-emerald-500 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:scale-105 active:scale-95';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      {/* Conteúdo do botão */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
}; 