import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  ...props 
}) => {
  const baseStyle = 'btn';
  const variantStyle = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  }[variant];

  // Tailwind can be used here alongside the vanilla classes
  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
