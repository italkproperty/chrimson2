import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
      aria-label="Toggle Dark Mode"
    >
      <div className="relative w-5 h-5 overflow-hidden">
         <motion.div
           initial={false}
           animate={{ y: theme === 'dark' ? -24 : 0 }}
           transition={{ type: "spring", stiffness: 300, damping: 20 }}
           className="absolute flex flex-col items-center"
         >
            <Sun size={20} className="text-slate-600 dark:text-slate-300 mb-1" />
            <Moon size={20} className="text-slate-600 dark:text-slate-300" />
         </motion.div>
      </div>
    </button>
  );
};