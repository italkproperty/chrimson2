import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { generateBlogPost, BlogGenerationParams, GeneratedBlogResponse } from '../../services/geminiService';

interface BlogGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: GeneratedBlogResponse) => void;
}

export const BlogGeneratorModal: React.FC<BlogGeneratorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [params, setParams] = useState<BlogGenerationParams>({
    topic: '',
    audience: 'Entrepreneurs',
    category: 'Compliance',
    keywords: '',
    tone: 'Professional'
  });
  
  const [status, setStatus] = useState<'idle' | 'researching' | 'drafting' | 'optimizing' | 'complete'>('idle');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!params.topic || !params.keywords) {
      setError('Please provide a topic and at least one keyword.');
      return;
    }
    setError('');
    setStatus('researching');

    // Simulate phases for UX
    setTimeout(() => setStatus('drafting'), 1500);
    setTimeout(() => setStatus('optimizing'), 3500);

    try {
      const result = await generateBlogPost(params);
      if (result) {
        setStatus('complete');
        setTimeout(() => {
          onSuccess(result);
          onClose();
          // Reset state for next time
          setTimeout(() => setStatus('idle'), 500); 
        }, 1000);
      } else {
        setError('Generation failed. Please try again.');
        setStatus('idle');
      }
    } catch (e) {
      setError('An error occurred during generation.');
      setStatus('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => status === 'idle' && onClose()}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-purple-400" size={20} />
                AI Content Engine
              </h2>
              <p className="text-slate-400 text-sm mt-1">Generate authoritative, 1,500-word guides in seconds.</p>
            </div>
            <button onClick={onClose} disabled={status !== 'idle'} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {status === 'idle' ? (
              <div className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Blog Topic / Prompt</label>
                  <input 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
                    placeholder="e.g. A comprehensive guide to registering a Pty Ltd in 2024"
                    value={params.topic}
                    onChange={e => setParams({...params, topic: e.target.value})}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Target Audience</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 text-sm"
                      value={params.audience}
                      onChange={e => setParams({...params, audience: e.target.value})}
                    >
                      <option>Entrepreneurs</option>
                      <option>Foreign Investors</option>
                      <option>SMEs</option>
                      <option>Tender-Focused Businesses</option>
                      <option>Tourism Operators</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tone</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 text-sm"
                      value={params.tone}
                      onChange={e => setParams({...params, tone: e.target.value})}
                    >
                      <option>Professional</option>
                      <option>Advisory</option>
                      <option>Educational</option>
                      <option>Executive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Focus Keyword</label>
                  <input 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-900"
                    placeholder="e.g. Namibia company registration, BIPA compliance"
                    value={params.keywords}
                    onChange={e => setParams({...params, keywords: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 text-sm"
                    value={params.category}
                    onChange={e => setParams({...params, category: e.target.value})}
                  >
                    <option>Compliance</option>
                    <option>Registration</option>
                    <option>Tax & Finance</option>
                    <option>Tourism</option>
                    <option>Tenders</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleGenerate} 
                    className="w-full justify-center bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 shadow-xl shadow-purple-900/10 text-white border-none py-3"
                  >
                    <Bot className="mr-2" size={18} /> Generate Full Draft
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center">
                    <Sparkles className="text-purple-600 animate-pulse" size={32} />
                  </div>
                  {/* Status Spinner Ring */}
                  <svg className="absolute inset-0 w-20 h-20 animate-spin-slow" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#e9d5ff" strokeWidth="2" />
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#9333ea" strokeWidth="2" strokeDasharray="30 270" strokeLinecap="round" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {status === 'researching' && 'Researching Namibian Laws...'}
                  {status === 'drafting' && 'Drafting Content & Structure...'}
                  {status === 'optimizing' && 'Applying SEO Best Practices...'}
                  {status === 'complete' && 'Draft Ready!'}
                </h3>
                
                <p className="text-slate-500 max-w-xs mx-auto">
                  {status === 'complete' 
                    ? 'Loading into editor...' 
                    : 'The AI is consulting BIPA regulations and structuring your 1,500-word article.'}
                </p>

                {status === 'complete' && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="mt-6 text-green-600 flex items-center gap-2 font-bold"
                  >
                    <CheckCircle2 size={20} /> Done
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};