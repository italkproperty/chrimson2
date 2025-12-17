import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { TrustBanner } from './ui/TrustBanner';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const blurValue = useTransform(scrollY, [0, 300], [0, 5]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setImageLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-20 bg-sand-50 dark:bg-slate-950 transition-colors">
      
      {/* Background Abstract Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[-10%] right-[-15%] w-[800px] h-[800px] bg-chrimson-800/10 dark:bg-chrimson-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-[20%] right-[30%] w-[600px] h-[600px] bg-sand-300/40 dark:bg-slate-800/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000"
        />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        
        <motion.svg 
          style={{ filter: `blur(${blurValue}px)` }}
          className="absolute top-1/2 right-[-10%] -translate-y-1/2 h-[120vh] w-auto text-chrimson-800/[0.03] dark:text-white/[0.02]" 
          viewBox="0 0 100 100" 
          fill="currentColor"
        >
           <path d="M50 10C30 10 10 30 10 50C10 70 30 90 50 90V70C40 70 30 60 30 50C30 40 40 30 50 30V10Z" />
        </motion.svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Content Column */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-sand-200 dark:border-slate-700 rounded-full px-3 py-1 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-chrimson-600 animate-pulse"></span>
              <span className="text-xs font-semibold text-chrimson-900 dark:text-chrimson-300 tracking-wide uppercase">Official Namibian Registration</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className={`text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 transition-all duration-700 ${imageLoaded ? 'blur-0' : 'blur-sm'}`}
            >
              Register your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-chrimson-800 to-chrimson-600">
                Namibian Business
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-xl text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium"
            >
              Close Corporation, Private Company, and NPO registrations — fast 7–14 day processing with full BIPA & compliance support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button size="lg" className="group" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth'})}>
                Get Registration Quote
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/50 dark:bg-slate-800/50 border-sand-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-800" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth'})}>
                Book Consultation
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 flex items-center gap-8"
            >
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white flex"><AnimatedCounter value={150} duration={2} />+</span>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Registered</span>
               </div>
               <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white flex"><AnimatedCounter value={25} duration={1.5} />+</span>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Tenders Won</span>
               </div>
               <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">100%</span>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Compliance</span>
               </div>
            </motion.div>
          </div>

          {/* Right Hero Canvas (Glass Card) */}
          <motion.div style={{ y: y2 }} className="relative hidden lg:block h-[600px] perspective-1000">
             <motion.div 
               animate={{ y: [0, -20, 0], rotateY: [0, 5, 0] }} 
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
             >
                <div className="glass-card p-8 rounded-3xl max-w-md mx-auto relative z-10 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 hover:scale-[1.02] hover:shadow-2xl">
                   <div className="flex justify-between items-center mb-8">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chrimson-700 to-chrimson-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">C</div>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="h-2 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                      <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                   </div>
                   <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center">
                         <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold">Status</p>
                            <p className="font-bold text-slate-800 dark:text-white">BIPA Approved</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase font-semibold">Type</p>
                            <p className="font-bold text-slate-800 dark:text-white">Pty Ltd</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="absolute -z-20 -right-12 -top-12 w-32 h-32 bg-sand-300 dark:bg-chrimson-900/40 rounded-full blur-2xl opacity-60"></div>
                <div className="absolute -z-20 -left-8 -bottom-8 w-48 h-48 bg-chrimson-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60"></div>
             </motion.div>
          </motion.div>
          
        </div>
      </div>
      
      {/* Dynamic Trust Banner integrated at fold */}
      <div className="w-full relative z-20 mt-auto">
         <TrustBanner />
      </div>
    </section>
  );
};