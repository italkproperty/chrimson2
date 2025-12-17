import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle, TrendingUp, Building2 } from 'lucide-react';
import { db } from '../../services/mockDb';

export const TrustBanner: React.FC = () => {
  const config = db.getTrustConfig();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (config.caseSnippets.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % config.caseSnippets.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [config.caseSnippets]);

  if (!config.trustedCount && !config.caseSnippets.length) return null;

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 py-3 md:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
        
        {/* Trusted Count Badge */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client" className="w-full h-full object-cover grayscale" />
              </div>
            ))}
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Trusted by <span className="text-chrimson-700">{config.trustedCount}+</span> Namibian Businesses
          </div>
        </div>

        {/* Rotating Proof Snippet */}
        {config.caseSnippets.length > 0 && (
          <div className="flex-1 flex justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={config.caseSnippets[index].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm whitespace-nowrap"
              >
                <TrendingUp size={16} className="text-green-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {config.caseSnippets[index].businessType}
                </span>
                <span className="text-slate-400">→</span>
                <span>{config.caseSnippets[index].outcome}</span>
                <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  in {config.caseSnippets[index].timeframe}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Authority References */}
        {config.showAuthorityLogos && (
          <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="text-[10px] font-black tracking-widest text-slate-800 dark:text-slate-400 border border-slate-800 dark:border-slate-400 px-1">BIPA</span>
            <span className="text-[10px] font-black tracking-widest text-slate-800 dark:text-slate-400">NAMRA</span>
            <span className="text-[10px] font-black tracking-widest text-slate-800 dark:text-slate-400">SSC</span>
          </div>
        )}

      </div>
    </div>
  );
};