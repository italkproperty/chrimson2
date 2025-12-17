import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Check, ShieldCheck, Landmark, Building2, Globe, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePricing } from '../contexts/PricingContext';
import { Currency, ServiceCategory, ServiceProduct } from '../types';

const CATEGORY_ICONS: Record<ServiceCategory, any> = {
  'Registration': Building2,
  'Foreign-Owned': Globe,
  'NGO': Heart,
  'Regulatory': Landmark,
  'Compliance': ShieldCheck,
  'Tourism': Globe,
  'Financial': Landmark
};

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  'Registration': 'Business Registration',
  'Foreign-Owned': 'Foreign-Owned Entities',
  'NGO': 'NGO & Non-Profit',
  'Regulatory': 'Regulatory Registrations',
  'Compliance': 'Compliance & Good Standing',
  'Tourism': 'Tourism Services',
  'Financial': 'Financial Services'
};

const ServiceCard: React.FC<{ 
  pkg: ServiceProduct; 
  formatPrice: (val: number) => string;
  onCtaClick: () => void;
}> = ({ pkg, formatPrice, onCtaClick }) => {
  const Icon = CATEGORY_ICONS[pkg.category] || ShieldCheck;
  const isAddon = pkg.type === 'addon';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className={`relative p-8 rounded-3xl flex flex-col h-full transition-all duration-300 border ${
        pkg.recommended 
          ? 'bg-slate-900 border-chrimson-600/30 text-white shadow-2xl ring-2 ring-chrimson-600/20' 
          : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F9FAFB] shadow-sm hover:shadow-xl hover:border-chrimson-500/30'
      }`}
    >
      {pkg.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chrimson-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg z-10">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${
            pkg.recommended 
              ? 'bg-white/10 text-chrimson-400' 
              : 'bg-chrimson-50 dark:bg-chrimson-900/20 text-chrimson-700 dark:text-chrimson-400'
          }`}>
            <Icon size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            {pkg.timeline}
          </span>
        </div>
        
        <h3 className="text-xl font-extrabold mb-2 tracking-tight">
          {pkg.name}
        </h3>
        <p className={`text-sm leading-relaxed mb-6 font-medium ${
          pkg.recommended ? 'text-slate-400' : 'text-slate-500 dark:text-[#D1D5DB]'
        }`}>
          {pkg.description}
        </p>
        
        <div className="text-3xl font-black flex items-baseline gap-1">
          {formatPrice(pkg.price)}
          {!isAddon && <span className="text-xs text-slate-400 font-bold uppercase ml-1">Setup</span>}
        </div>
      </div>

      {pkg.features && pkg.features.length > 0 && (
        <ul className="space-y-3.5 mb-8 flex-1 border-t border-slate-100 dark:border-white/5 pt-6">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <Check size={16} className="mt-0.5 text-chrimson-500 flex-shrink-0" />
              <span className={pkg.recommended ? 'text-slate-300' : 'text-slate-700 dark:text-[#D1D5DB]'}>
                {f}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Button 
        variant={pkg.recommended ? 'primary' : 'outline'} 
        className="w-full mt-auto group"
        onClick={onCtaClick}
      >
        <span className="flex items-center gap-2">
          {isAddon ? 'Add to Order' : 'Start Registration'}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Button>
    </motion.div>
  );
};

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { products, formatPrice, currency, setCurrency } = usePricing();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('Registration');

  const categories: (ServiceCategory | 'All')[] = [
    'All', 'Registration', 'Foreign-Owned', 'NGO', 'Regulatory', 'Compliance'
  ];

  // Restored full currency list
  const currencies: Currency[] = ['NAD', 'USD', 'ZAR', 'EUR', 'GBP', 'JPY'];

  const filteredProducts = products.filter(p => p.active && (activeCategory === 'All' || p.category === activeCategory));

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-[#080c13] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-base text-chrimson-700 font-black tracking-widest uppercase mb-3">Investment Guide</h2>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-[#F9FAFB] mb-5 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-500 dark:text-[#D1D5DB] font-medium leading-relaxed">
              No hidden fees. Every service includes professional document drafting and official filing with Namibian regulatory bodies.
            </p>
          </motion.div>
        </div>

        {/* Multi-Currency & Category Switcher */}
        <div className="flex flex-col gap-8 items-center mb-16">
          {/* Currency Dropdown/Switcher */}
          <div className="flex flex-col items-center gap-3">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Currency</span>
             <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-white/5 shadow-sm">
               {currencies.map((c) => (
                 <button
                   key={c}
                   onClick={() => setCurrency(c)}
                   className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 ${
                     currency === c 
                       ? 'bg-white dark:bg-slate-800 text-chrimson-700 dark:text-chrimson-400 shadow-md scale-105' 
                       : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                   }`}
                 >
                   {c}
                 </button>
               ))}
             </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all duration-300 border-2 ${
                  activeCategory === cat 
                    ? 'bg-chrimson-700 text-white border-chrimson-700 shadow-xl shadow-chrimson-900/20' 
                    : 'bg-white dark:bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-chrimson-500/50'
                }`}
              >
                {cat === 'All' ? 'VIEW ALL SERVICES' : CATEGORY_LABELS[cat as ServiceCategory].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((pkg) => (
              <ServiceCard 
                key={pkg.id} 
                pkg={pkg} 
                formatPrice={formatPrice} 
                onCtaClick={() => navigate('/order')}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Regulatory Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-6 items-center"
        >
          <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm flex-shrink-0">
            <Landmark size={28} />
          </div>
          <p className="text-xs text-slate-500 dark:text-[#D1D5DB] leading-relaxed font-medium">
            <strong className="text-slate-900 dark:text-white uppercase tracking-wider block mb-1">Regulatory & Compliance Disclaimer</strong>
            Chrimson Consultants provides professional administrative and filing services with BIPA, NAMRA, SSC, NTB, and NAMFISA. While we maintain a 100% success rate for properly submitted documents, we do not guarantee or imply automatic approval by any regulatory body. Approval is strictly subject to the discretion and requirements of the respective Namibian government authority.
          </p>
        </motion.div>
      </div>
    </section>
  );
};