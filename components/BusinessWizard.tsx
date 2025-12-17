import React, { useState } from 'react';
import { WIZARD_DATA } from '../constants';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BusinessWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>('q1');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const currentQuestion = WIZARD_DATA.find(q => q.id === currentStep);

  const handleOptionClick = (option: any) => {
    if (option.recommendation) {
      setResult(option.recommendation);
    } else if (option.nextId) {
      setHistory([...history, currentStep]);
      setCurrentStep(option.nextId);
    }
  };

  const handleReset = () => {
    setCurrentStep('q1');
    setResult(null);
    setHistory([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <div>
             <h3 className="text-white font-bold text-lg flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-chrimson-500 animate-pulse"></span>
               Business Type Selector
             </h3>
             <p className="text-slate-400 text-sm">AI-Guided Recommendation</p>
          </div>
          {history.length > 0 && !result && (
             <button onClick={handleReset} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
               <RotateCcw size={12} /> Restart
             </button>
          )}
        </div>

        <div className="p-8 min-h-[300px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!result && currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h4 className="text-xl md:text-2xl font-semibold text-slate-800 leading-tight">
                  {currentQuestion.question}
                </h4>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01, backgroundColor: '#f8fafc' }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleOptionClick(option)}
                      className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-chrimson-200 hover:shadow-md transition-all group flex justify-between items-center"
                    >
                      <span className="text-slate-700 font-medium group-hover:text-chrimson-700 transition-colors">{option.label}</span>
                      <ChevronRight className="text-slate-300 group-hover:text-chrimson-400" size={20}/>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                   <p className="text-slate-500 text-sm uppercase tracking-wide font-semibold mb-2">Recommended Structure</p>
                   <h3 className="text-3xl font-bold text-slate-900">{result}</h3>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-slate-600 text-sm">
                   Based on your answers, this structure offers the best balance of liability protection and operational flexibility for your goals.
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                   <Link to="/contact" className="flex-1">
                     <Button className="w-full">Register This Now</Button>
                   </Link>
                   <Button variant="outline" onClick={handleReset} className="flex-1">Start Over</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full">
           <motion.div 
             className="h-full bg-chrimson-500"
             initial={{ width: '0%' }}
             animate={{ width: result ? '100%' : `${((history.length + 1) / 4) * 100}%` }}
           />
        </div>
      </div>
    </div>
  );
};