import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/mockDb';
import { OrderState, PaymentMethod, Currency } from '../types';
import { Button } from '../components/ui/Button';
import { FileUpload } from '../components/ui/FileUpload';
import { Logo } from '../components/ui/Logo';
import { usePricing } from '../contexts/PricingContext';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { trackEvent } from '../services/analytics';
import { 
  Check, ChevronRight, ChevronLeft, CreditCard, Landmark, 
  Smartphone, Wallet, Lock, ShieldCheck, CheckCircle2, 
  ArrowRight, Loader2, Info, Building, FileText, Phone, 
  LayoutDashboard, User, Clock, Download, Mail
} from 'lucide-react';

// Price change animation component
const AnimatedPrice = ({ value, currency }: { value: number, currency: string }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center"
    >
      <span className="mr-1">{currency === 'NAD' ? 'N$' : currency}</span>
      <AnimatedCounter value={value} duration={0.5} />
    </motion.span>
  );
};

const Confetti = () => {
  useEffect(() => {
    const canvas = document.getElementById('confetti') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#B40000', '#e02424', '#f05252', '#f98080'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 2,
        d: Math.random() * 20 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05
      });
    }

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.lineWidth = p.d;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();

        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        if (p.y > canvas.height) {
          particles[i] = { ...p, x: Math.random() * canvas.width, y: -20 };
        }
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();
    setTimeout(() => cancelAnimationFrame(animationId), 5000);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas id="confetti" className="fixed inset-0 pointer-events-none z-50" />;
};

const STEPS = [
  { id: 1, label: 'Client Details' },
  { id: 2, label: 'Select Service' },
  { id: 3, label: 'Choose Add-Ons' },
  { id: 4, label: 'Review Order' },
  { id: 5, label: 'Confirm & Pay' },
];

export const OrderWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { packages, addons, formatPrice, convertPrice, currency } = usePricing();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [generatedClientId, setGeneratedClientId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  // CRO: Track start of registration
  useEffect(() => {
    trackEvent('start_registration', { page: 'OrderWizard' });
  }, []);

  // Order State
  const [order, setOrder] = useState<OrderState>({
    selectedPackageId: null,
    selectedAddOns: [],
    customerName: '',
    customerIdNumber: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    referralSource: '',
    businessName1: '', 
    businessName2: '',
    businessName3: '',
    businessType: 'Pending',
    uploads: {},
    paymentMethod: 'EFT',
    currency: currency,
  });

  // Calculate Totals
  const selectedPkg = packages.find(p => p.id === order.selectedPackageId);
  const selectedAddonsList = addons.filter(a => order.selectedAddOns.includes(a.id));
  
  const subtotalNAD = (selectedPkg?.price || 0) + selectedAddonsList.reduce((acc, curr) => acc + curr.price, 0);
  const subtotal = convertPrice(subtotalNAD);
  const vat = subtotal * 0.15;
  const grandTotal = subtotal + vat;

  useEffect(() => {
     setTotalAmount(formatPrice(subtotalNAD + (subtotalNAD * 0.15)));
  }, [subtotalNAD, currency]);

  // Validation
  const validateStep = (step: number) => {
    if (step === 1) {
      return order.customerName && order.customerIdNumber && order.customerEmail && order.customerPhone && order.customerAddress;
    }
    if (step === 2) {
      return !!order.selectedPackageId;
    }
    return true;
  };

  const changeStep = (newStep: number) => {
    if (newStep > currentStep && !validateStep(currentStep)) return;
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const result = db.processOrder({...order, currency, grandTotal});
        setGeneratedRef(result.project.reference);
        setGeneratedClientId(result.client.id);
        
        // CRO: track_order handled within db.processOrder wrapper
        
        setIsSubmitting(false);
        setIsSuccess(true);
        window.scrollTo(0,0);
      } catch (e) {
        alert("Error submitting order. Please try again.");
        setIsSubmitting(false);
      }
    }, 2000);
  };

  if (isSuccess) {
    return <SuccessView reference={generatedRef} totalFormatted={totalAmount} clientId={generatedClientId} />;
  }

  // Variants for sliding transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 h-16 flex items-center justify-between px-4 md:px-8">
        <Logo className="h-8" />
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
          <Lock size={12} className="text-green-600"/> Secure SSL Encryption
        </div>
      </div>

      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Progress Indicators */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex justify-between items-center relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
            <motion.div 
              className="absolute top-1/2 left-0 h-0.5 bg-chrimson-700 -z-10 -translate-y-1/2 origin-left"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {STEPS.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 bg-[#FBF9F6] dark:bg-slate-950 px-2">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      backgroundColor: isCompleted || isCurrent ? '#B40000' : '#ffffff',
                      borderColor: isCompleted || isCurrent ? '#B40000' : '#e2e8f0',
                      scale: isCurrent ? 1.2 : 1
                    }}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 relative z-10
                      ${isCompleted || isCurrent ? 'text-white shadow-lg shadow-chrimson-700/30' : 'text-slate-400 bg-white dark:bg-slate-800 dark:border-slate-700'}
                    `}
                  >
                    {isCompleted ? <Check size={14} /> : step.id}
                  </motion.div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider hidden md:block ${isCurrent ? 'text-chrimson-700' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="md:hidden text-center mt-4 text-sm font-bold text-slate-900 dark:text-white">
             {STEPS[currentStep - 1].label}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
          
          {/* Main Wizard Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                
                {/* Step 1: Client Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Let's start with your details.</h2>
                      <p className="text-slate-500">We need this for the official company registration documents.</p>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                             <input 
                               autoFocus
                               value={order.customerName}
                               onChange={(e) => setOrder({...order, customerName: e.target.value})}
                               className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-chrimson-700 focus:border-chrimson-700 outline-none transition-all dark:text-white"
                               placeholder="e.g. John Doe"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">ID / Passport Number</label>
                             <input 
                               value={order.customerIdNumber}
                               onChange={(e) => setOrder({...order, customerIdNumber: e.target.value})}
                               className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-chrimson-700 focus:border-chrimson-700 outline-none transition-all dark:text-white"
                               placeholder="ID Number"
                             />
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                             <input 
                               type="email"
                               value={order.customerEmail}
                               onChange={(e) => setOrder({...order, customerEmail: e.target.value})}
                               className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-chrimson-700 focus:border-chrimson-700 outline-none transition-all dark:text-white"
                               placeholder="name@example.com"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number (+264)</label>
                             <input 
                               value={order.customerPhone}
                               onChange={(e) => setOrder({...order, customerPhone: e.target.value})}
                               className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-chrimson-700 focus:border-chrimson-700 outline-none transition-all dark:text-white"
                               placeholder="+264 81..."
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Physical Address</label>
                          <textarea 
                            value={order.customerAddress}
                            onChange={(e) => setOrder({...order, customerAddress: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-chrimson-700 focus:border-chrimson-700 outline-none transition-all h-24 resize-none dark:text-white"
                            placeholder="Street, City, Region..."
                          />
                       </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Select Service */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Select your service.</h2>
                      <p className="text-slate-500">Choose the legal structure you want to register.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {packages.filter(p => p.active).map((pkg) => (
                        <motion.div 
                          key={pkg.id}
                          whileHover={{ y: -4, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                          onClick={() => setOrder({...order, selectedPackageId: pkg.id})}
                          className={`
                            relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group bg-white dark:bg-slate-900
                            ${order.selectedPackageId === pkg.id 
                                ? 'border-chrimson-700 ring-1 ring-chrimson-700 shadow-xl shadow-chrimson-900/5' 
                                : 'border-slate-100 dark:border-slate-800 hover:border-chrimson-200 dark:hover:border-chrimson-900'}
                          `}
                        >
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{pkg.tagline}</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-chrimson-700 transition-colors">{pkg.name}</h3>
                              </div>
                              {order.selectedPackageId === pkg.id ? (
                                <div className="w-6 h-6 rounded-full bg-chrimson-700 text-white flex items-center justify-center">
                                  <Check size={14} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700"></div>
                              )}
                           </div>
                           
                           <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 h-10 line-clamp-2">{pkg.description}</p>
                           
                           <div className="flex items-end justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                              <div className="flex items-center gap-1 text-slate-400 text-xs">
                                 <Clock size={12} /> {pkg.timeline}
                              </div>
                              <div className="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(pkg.price)}</div>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Add-ons */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Enhance your compliance.</h2>
                      <p className="text-slate-500">Select any additional certificates or registrations required.</p>
                    </div>

                    <div className="space-y-8">
                      {['General', 'Tourism', 'Financial'].map(cat => {
                          const items = addons.filter(a => a.category === cat && a.active);
                          if (items.length === 0) return null;
                          return (
                             <div key={cat}>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-1">{cat} Add-ons</h3>
                                <div className="space-y-3">
                                  {items.map(addon => {
                                      const isSelected = order.selectedAddOns.includes(addon.id);
                                      return (
                                        <motion.div 
                                          key={addon.id}
                                          whileHover={{ scale: 1.01 }}
                                          whileTap={{ scale: 0.99 }}
                                          onClick={() => {
                                              const newAddons = isSelected 
                                                ? order.selectedAddOns.filter(id => id !== addon.id)
                                                : [...order.selectedAddOns, addon.id];
                                              setOrder({...order, selectedAddOns: newAddons});
                                          }}
                                          className={`
                                            flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all bg-white dark:bg-slate-900
                                            ${isSelected 
                                                ? 'border-chrimson-700 bg-chrimson-50/10' 
                                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}
                                          `}
                                        >
                                          <div className="flex items-center gap-4">
                                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-chrimson-700 border-chrimson-700 text-white' : 'border-slate-300 bg-white'}`}>
                                                 {isSelected && <Check size={12} />}
                                              </div>
                                              <div>
                                                  <h4 className={`font-bold transition-colors ${isSelected ? 'text-chrimson-700' : 'text-slate-900 dark:text-white'}`}>{addon.name}</h4>
                                                  <p className="text-xs text-slate-500">{addon.description}</p>
                                              </div>
                                          </div>
                                          <div className="text-right">
                                              <div className="font-bold text-slate-900 dark:text-white text-sm">
                                                {formatPrice(addon.price)}
                                              </div>
                                              <div className="text-[10px] text-slate-400 mt-0.5">{addon.timeline}</div>
                                          </div>
                                        </motion.div>
                                      );
                                  })}
                                </div>
                             </div>
                          );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Review & Confirm</h2>
                      <p className="text-slate-500">Please ensure all details are correct before proceeding.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                       <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-6">Client Details</h3>
                          <div className="grid grid-cols-2 gap-y-4 text-sm">
                             <div>
                                <p className="text-slate-500 text-xs uppercase mb-1">Name</p>
                                <p className="font-medium text-slate-900 dark:text-white">{order.customerName}</p>
                             </div>
                             <div>
                                <p className="text-slate-500 text-xs uppercase mb-1">ID Number</p>
                                <p className="font-medium text-slate-900 dark:text-white">{order.customerIdNumber}</p>
                             </div>
                             <div>
                                <p className="text-slate-500 text-xs uppercase mb-1">Email</p>
                                <p className="font-medium text-slate-900 dark:text-white">{order.customerEmail}</p>
                             </div>
                             <div>
                                <p className="text-slate-500 text-xs uppercase mb-1">Phone</p>
                                <p className="font-medium text-slate-900 dark:text-white">{order.customerPhone}</p>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-6">Order Breakdown</h3>
                          <div className="space-y-3">
                             <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-900 dark:text-white">{selectedPkg?.name}</span>
                                <span className="text-slate-600 dark:text-slate-400">{formatPrice(selectedPkg?.price || 0)}</span>
                             </div>
                             {selectedAddonsList.map(addon => (
                               <div key={addon.id} className="flex justify-between items-center text-sm">
                                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span> {addon.name}
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-400">{formatPrice(addon.price)}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="p-8 bg-slate-50 dark:bg-slate-800/50">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-slate-500">Subtotal</span>
                             <span className="font-medium text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-6">
                             <span className="text-slate-500">VAT (15%)</span>
                             <span className="font-medium text-slate-900 dark:text-white">{formatPrice(vat)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
                             <span className="text-lg font-bold text-slate-900 dark:text-white">Total Due</span>
                             <span className="text-2xl font-bold text-chrimson-700">
                               <AnimatedPrice value={grandTotal} currency={currency === 'NAD' ? 'N$' : currency} />
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-900 rounded-xl text-sm">
                       <input type="checkbox" className="mt-1 rounded text-chrimson-700 focus:ring-chrimson-700" defaultChecked />
                       <p>I declare that the information provided is true and correct, and I authorize Chrimson Consultants to act on my behalf for this registration.</p>
                    </div>
                  </div>
                )}

                {/* Step 5: Payment */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Payment Required</h2>
                      <p className="text-slate-500">To finalize your order, please make a bank transfer.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-chrimson-50 rounded-bl-full z-0"></div>
                       
                       <div className="relative z-10">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                             <Landmark className="text-chrimson-700" size={24} /> Banking Details
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm mb-8">
                             <div>
                                <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Bank</span>
                                <span className="font-semibold text-slate-900 dark:text-white text-lg">First National Bank</span>
                             </div>
                             <div>
                                <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Account Name</span>
                                <span className="font-semibold text-slate-900 dark:text-white text-lg">Chrimson Investments CC</span>
                             </div>
                             <div className="md:col-span-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                   <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Account Number</span>
                                   <span className="font-mono font-bold text-slate-900 dark:text-white text-xl tracking-wide">64285820625</span>
                                </div>
                                <div className="text-right">
                                   <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Branch Code</span>
                                   <span className="font-medium text-slate-900 dark:text-white">Maerua Mall</span>
                                </div>
                             </div>
                             <div>
                                <span className="block text-xs text-slate-400 uppercase font-bold mb-1">SWIFT / BIC</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">FIRNNAX</span>
                             </div>
                             <div>
                                <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Reference</span>
                                <span className="font-mono font-bold text-chrimson-700 bg-chrimson-50 px-2 py-1 rounded">Use your Invoice No.</span>
                             </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                             <Button variant="outline" className="flex-1 justify-center">
                                <Download size={16} className="mr-2"/> Download Invoice
                             </Button>
                             <Button variant="outline" className="flex-1 justify-center">
                                <Mail size={16} className="mr-2"/> Email Invoice
                             </Button>
                          </div>
                       </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-800 text-sm">
                       <Info size={20} className="flex-shrink-0 mt-0.5" />
                       <div>
                          <strong>Proof of Payment:</strong> Please email your POP to <a href="mailto:hello@chrimsoncc.com" className="underline font-bold">hello@chrimsoncc.com</a> or WhatsApp <a href="tel:+264817121176" className="underline font-bold">+264 81 712 1176</a> to initiate registration.
                       </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="mt-12 flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
               {currentStep > 1 && currentStep < 5 && (
                 <Button variant="ghost" onClick={() => changeStep(currentStep - 1)} className="text-slate-500">
                    <ChevronLeft size={16} className="mr-2" /> Back
                 </Button>
               )}
               <div className="flex-1"></div> {/* Spacer */}
               {currentStep < 4 ? (
                 <Button 
                    onClick={() => changeStep(currentStep + 1)} 
                    size="lg" 
                    className="px-8 shadow-lg shadow-chrimson-700/20"
                    disabled={!validateStep(currentStep)}
                 >
                    Next Step <ChevronRight size={16} className="ml-2" />
                 </Button>
               ) : currentStep === 4 ? (
                 <Button 
                    onClick={() => changeStep(5)} 
                    size="lg" 
                    className="px-8 bg-chrimson-700 hover:bg-chrimson-800 shadow-lg shadow-chrimson-700/30"
                 >
                    Confirm Order <ArrowRight size={16} className="ml-2" />
                 </Button>
               ) : (
                 <Button 
                    onClick={submitOrder} 
                    disabled={isSubmitting}
                    size="lg" 
                    className="px-8 bg-slate-900 text-white hover:bg-slate-800"
                    loading={isSubmitting}
                 >
                    {isSubmitting ? "Processing" : "Finish Order"}
                 </Button>
               )}
            </div>
          </div>

          {/* Sticky Sidebar (Steps 2-4) */}
          {currentStep >= 2 && currentStep <= 4 && (
            <div className="hidden lg:block lg:col-span-4">
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="sticky top-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl shadow-xl p-6"
               >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Live Summary</h3>
                  
                  <div className="space-y-4">
                     {/* Selected Service */}
                     <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPkg?.name || 'No Service'}</p>
                           <p className="text-xs text-slate-500">{selectedPkg ? 'Base Price' : 'Select a service'}</p>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white">{formatPrice(convertPrice(selectedPkg?.price || 0))}</p>
                     </div>

                     {/* Add-ons */}
                     <AnimatePresence>
                       {selectedAddonsList.map(addon => (
                         <motion.div 
                           key={addon.id}
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="flex justify-between items-center text-sm"
                         >
                            <span className="text-slate-600 dark:text-slate-400">{addon.name}</span>
                            <span className="text-slate-900 dark:text-white">{formatPrice(convertPrice(addon.price))}</span>
                         </motion.div>
                       ))}
                     </AnimatePresence>
                     
                     {/* Totals */}
                     <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-slate-500 text-sm mb-1">
                           <span>Subtotal</span>
                           <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-sm mb-4">
                           <span>VAT (15%)</span>
                           <span>{formatPrice(vat)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl text-white shadow-lg">
                           <span className="font-medium">Total</span>
                           <span className="text-xl font-bold">
                             <AnimatedPrice value={grandTotal} currency={currency === 'NAD' ? 'N$' : currency} />
                           </span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const SuccessView: React.FC<{ reference: string, totalFormatted: string, clientId: string }> = ({ reference, totalFormatted, clientId }) => {
   const navigate = useNavigate();
   return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
         <Confetti />
         <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center relative z-10"
         >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order Confirmed!</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
               Your order has been placed successfully. An invoice has been sent to your email.
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl mb-8 border border-slate-200 dark:border-slate-700 text-left">
               <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs text-slate-400 uppercase font-bold">Reference</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{reference}</span>
               </div>
               
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Next Steps:</p>
               <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-6">
                  <li>Make an EFT of <strong>{totalFormatted}</strong>.</li>
                  <li>Use Reference <strong>{reference}</strong>.</li>
                  <li>Email proof of payment to <strong>hello@chrimsoncc.com</strong>.</li>
               </ol>
               
               <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm space-y-1">
                  <p><span className="text-slate-500 w-24 inline-block font-medium">Bank:</span> <strong className="dark:text-white">First National Bank</strong></p>
                  <p><span className="text-slate-500 w-24 inline-block font-medium">Account:</span> <strong className="dark:text-white">Chrimson Investments CC</strong></p>
                  <p><span className="text-slate-500 w-24 inline-block font-medium">Number:</span> <strong className="dark:text-white">64285820625</strong></p>
                  <p><span className="text-slate-500 w-24 inline-block font-medium">Branch:</span> <strong className="dark:text-white">Maerua Mall</strong></p>
                  <p><span className="text-slate-500 w-24 inline-block font-medium">Ref:</span> <strong className="dark:text-white">{reference}</strong></p>
               </div>
            </div>

            <div className="space-y-3">
               <Button onClick={() => navigate(`/portal/${clientId}`)} className="w-full justify-center gap-2 shadow-xl shadow-chrimson-500/20">
                  <LayoutDashboard size={16} /> Access Client Portal
               </Button>
               <Button variant="outline" onClick={() => navigate('/')} className="w-full justify-center">
                  Return Home
               </Button>
            </div>
         </motion.div>
      </div>
   );
}