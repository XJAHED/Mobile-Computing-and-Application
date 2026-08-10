import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', fullWidth = false }) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg active:scale-95',
    secondary: 'bg-red-50 text-red-600 hover:bg-red-100 shadow-sm active:scale-95',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:scale-95',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
