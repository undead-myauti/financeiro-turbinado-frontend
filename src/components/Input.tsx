import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = '',
}) => {
  return (
    <div className={`mb-3 md:mb-4 ${className}`}>
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border transition-all duration-200
          bg-gray-900 border-gray-700 text-white placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
        `}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}; 