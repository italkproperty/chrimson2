import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useViewMode } from '../../contexts/ViewModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, User } from 'lucide-react';

export const ViewModeToggle: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isAdminView, toggleViewMode } = useViewMode();

  if (!isAuthenticated) return null;

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-20 right-4 z-[60]"
    >
      <div 
        className={`
          flex items-center gap-2 p-1.5 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300
          ${isAdminView 
            ? 'bg-slate-900/90 border-slate-700 text-white' 
            : 'bg-white/90 border-slate-200 text-slate-700'
          }
        `}
      >
        <button
          onClick={toggleViewMode}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {isAdminView ? (
              <motion.div 
                key="admin"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShieldCheck size={14} className="text-chrimson-500" />
                <span>Admin View</span>
              </motion.div>
            ) : (
              <motion.div 
                key="user"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <User size={14} className="text-blue-500" />
                <span>User View</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Status Indicator Dot */}
          <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isAdminView ? 'bg-chrimson-500' : 'bg-blue-500'} animate-pulse`}></div>
        </button>
      </div>
    </motion.div>
  );
};