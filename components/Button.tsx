
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider';
  
  const variants = {
    primary: 'bg-[#00b4ff] text-white hover:bg-[#0094d1] shadow-lg shadow-blue-500/20',
    neon: 'bg-[#00b4ff] text-white hover:shadow-[0_0_20px_rgba(0,180,255,0.6)] border border-cyan-400',
    secondary: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700',
    ghost: 'bg-transparent text-slate-400 hover:bg-white/5',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30',
    whatsapp: 'bg-emerald-600 text-white hover:bg-emerald-700'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-3 text-sm'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
