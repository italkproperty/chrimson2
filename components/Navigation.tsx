import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { Button } from './ui/Button';
import { Menu, X, ChevronDown, Phone, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './ui/Logo';
import { useAuth } from '../contexts/AuthContext';
import { useViewMode } from '../contexts/ViewModeContext';
import { ThemeToggle } from './ui/ThemeToggle';

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isAdminView } = useViewMode();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle Home Click Logic
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname.startsWith('/admin')) {
        navigate('/');
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  // Only show Admin Link if Authenticated AND in Admin View
  const showAdminLink = isAuthenticated && isAdminView;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-sand-200 dark:border-slate-800 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              onClick={handleHomeClick}
              className="flex-shrink-0 flex items-center z-50"
            >
              <Logo className="h-10" theme={isScrolled ? 'light' : 'light'} /> 
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <div 
                  key={item.label} 
                  className="relative group"
                  onMouseEnter={() => setHoveredLink(item.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <Link
                    to={item.href}
                    onClick={item.href === '/' ? handleHomeClick : undefined}
                    className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-chrimson-800 dark:hover:text-chrimson-400 transition-colors py-2"
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />}
                  </Link>
                  
                  {/* Hover Dropdown */}
                  {item.children && hoveredLink === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-56 pt-2"
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-sand-100 dark:border-slate-700 overflow-hidden p-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-sand-50 dark:hover:bg-slate-800 hover:text-chrimson-800 dark:hover:text-chrimson-400 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
              
              {/* Admin Link (Icon Only) - Conditional */}
              <div className="relative group">
                 <Link
                   to={isAuthenticated ? (isAdminView ? '/admin/dashboard' : '#') : '/admin/login'}
                   className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
                     showAdminLink 
                       ? 'bg-chrimson-700 text-white border-chrimson-700 shadow-md scale-105' 
                       : 'bg-transparent border-slate-300 text-slate-400 hover:border-chrimson-700 hover:text-chrimson-700'
                   }`}
                   aria-label="Admin Login"
                   // Prevent navigation if auth but in User View (clicks usually handled by toggle, but link remains for login)
                   onClick={(e) => { if(isAuthenticated && !isAdminView) e.preventDefault(); }}
                 >
                   <span className="font-bold text-xs font-serif">C</span>
                 </Link>
              </div>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden lg:flex flex-col items-end text-right mr-2">
                 <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Support</span>
                 <a href="tel:+264817121176" className="text-sm font-bold text-slate-900 dark:text-white hover:text-chrimson-800 transition-colors">+264 81 712 1176</a>
              </div>
              <Link to="/order">
                <Button variant="primary" size="sm" className="shadow-lg shadow-chrimson-800/20">
                  Start Registration
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden z-50 flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 dark:text-slate-300 hover:text-chrimson-800 p-2 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
               onClick={() => setMobileMenuOpen(false)}
             />
             <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 z-50 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full pt-24 pb-6 px-6">
                <div className="space-y-6 flex-1">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.label} className="border-b border-sand-100 dark:border-slate-800 pb-4">
                      <Link
                        to={item.href}
                        onClick={item.href === '/' ? handleHomeClick : () => setMobileMenuOpen(false)}
                        className="block text-xl font-bold text-slate-900 dark:text-white mb-2"
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="pl-4 space-y-3 mt-2 border-l-2 border-sand-200 dark:border-slate-700">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-sm font-medium text-slate-500 dark:text-slate-400"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Dynamic Admin Link (Mobile - With Text) */}
                  <div className="border-b border-sand-100 dark:border-slate-800 pb-4">
                    <Link
                      to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                      onClick={(e) => {
                         if (isAuthenticated && !isAdminView) e.preventDefault(); 
                         setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-2"
                    >
                      <ShieldCheck size={20} className={showAdminLink ? "text-chrimson-600" : "text-slate-400"}/>
                      {showAdminLink ? 'Dashboard' : 'Admin Login'}
                    </Link>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="bg-sand-50 dark:bg-slate-800 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Contact Us</p>
                    <a href="tel:+264817121176" className="flex items-center gap-3 text-slate-900 dark:text-white font-bold mb-2">
                       <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-chrimson-800 dark:text-chrimson-400"><Phone size={14}/></div>
                       +264 81 712 1176
                    </a>
                  </div>
                  <Link to="/order" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                    <Button className="w-full justify-center">Start Registration</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};