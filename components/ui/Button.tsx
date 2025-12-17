import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  loading = false,
  disabled,
  onClick,
  ...props 
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const baseStyles = "relative inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden z-0";
  
  const variants = {
    // Primary: Brand Red Base
    primary: "bg-chrimson-700 text-white hover:bg-chrimson-800 shadow-lg shadow-chrimson-500/30 focus:ring-chrimson-500 border border-transparent",
    
    // Secondary: Slate Base -> Red Hover
    secondary: "bg-slate-900 text-white hover:bg-chrimson-700 shadow-lg shadow-slate-900/20 focus:ring-slate-900 border border-transparent",
    
    // Outline: Transparent/Bordered -> Red Hover & White Text
    outline: "border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-chrimson-700 hover:text-white hover:border-chrimson-700 focus:ring-chrimson-500",
    
    // Ghost: Transparent -> Red Hover & White Text
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:text-white hover:bg-chrimson-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.03, y: disabled || loading ? 0 : -3 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={(e) => {
          addRipple(e);
          onClick?.(e);
      }}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {/* Loading Shimmer */}
      {loading && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}

      {/* Ripple Effect */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
            }}
          />
        ))}
      </AnimatePresence>

      <span className={`flex items-center gap-2 relative z-10 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      
      {loading && (
         <span className="absolute inset-0 flex items-center justify-center z-20">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
         </span>
      )}
    </motion.button>
  );
};