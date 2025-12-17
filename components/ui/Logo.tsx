import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8", theme = 'light' }) => {
  const primaryColor = theme === 'light' ? '#8B1E3F' : '#FFFFFF'; // Garnet or White
  const secondaryColor = theme === 'light' ? '#0F1724' : '#F1E6D8'; // Slate or Sand
  
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square"
      >
        <path 
          d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35V28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12V5Z" 
          fill={primaryColor}
        />
        <path 
          d="M20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5V12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28V35Z" 
          fillOpacity="0.8"
          fill={primaryColor}
        />
        <circle cx="20" cy="20" r="3" fill={secondaryColor} />
      </svg>
      <span className={`font-bold text-xl tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
        Chrimson
      </span>
    </div>
  );
};