import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { ArrowRight, ChevronLeft, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check Lockout
    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      setError(`Too many attempts. Try again in ${remaining}s.`);
      return;
    } else if (lockedUntil) {
      setLockedUntil(null);
      setAttempts(0);
    }

    setIsLoading(true);
    setError('');
    
    // Simulate network delay for UX
    setTimeout(() => {
      const success = login(email, pass);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
           setLockedUntil(Date.now() + 60000); // 1 minute lockout
           setError('Too many failed attempts. Account locked for 1 minute.');
        } else {
           setError('Invalid credentials. Please check your email and password.');
        }
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center p-4 relative"
    >
      {/* Back Button */}
      <Link to="/" className="absolute top-8 left-8">
        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 gap-2 pl-2">
          <ChevronLeft size={18} />
          Back to Home
        </Button>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px]"
      >
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Logo className="h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-2">Secure login for Chrimson Consultants staff.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 mb-6 relative overflow-hidden">
          {lockedUntil && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                <ShieldAlert size={48} className="text-red-500 mb-4" />
                <h3 className="font-bold text-slate-900">Security Lockout</h3>
                <p className="text-sm text-slate-500 mt-2">Please wait before trying again.</p>
             </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg flex items-center gap-2"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-chrimson-500/20 focus:border-chrimson-500 transition-all text-sm"
                placeholder="hello@chrimsoncc.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-chrimson-500/20 focus:border-chrimson-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* 2FA Placeholder */}
            <div className="flex items-center gap-2 py-1 opacity-50 pointer-events-none">
               <input type="checkbox" disabled checked={false} className="rounded border-slate-300"/>
               <span className="text-xs text-slate-400">Enable 2FA (Coming Soon)</span>
            </div>

            <Button type="submit" className="w-full group justify-center bg-chrimson-700 hover:bg-chrimson-800" disabled={isLoading || !!lockedUntil}>
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>
        </div>
        
        <div className="text-center">
           <p className="text-xs text-slate-400">
             Protected by enterprise-grade security.
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
};