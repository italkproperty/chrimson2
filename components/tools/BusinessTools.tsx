import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, XCircle, Calculator, FileText, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

// --- Tool 1: Name Availability Mock ---
export const NameAvailabilityTool = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const checkAvailability = () => {
    if (!name) return;
    setStatus('checking');
    // Simulate API call
    setTimeout(() => {
      const isAvailable = Math.random() > 0.3; // Random mock result
      setStatus(isAvailable ? 'available' : 'taken');
    }, 1500);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
          <Search size={20} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Name Availability Check</h3>
        <p className="text-slate-500 text-sm mt-2">Check if your desired company name fits BIPA formatting rules.</p>
      </div>

      <div className="space-y-4 flex-1">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setStatus('idle');
            }}
            placeholder="Enter proposed name..."
            className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all uppercase placeholder:normal-case"
          />
        </div>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
             <Button onClick={checkAvailability} className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={!name}>
               Check Name
             </Button>
          )}
          {status === 'checking' && (
             <Button className="w-full bg-slate-100 text-slate-400 cursor-not-allowed" disabled>
               <Loader2 className="animate-spin mr-2" size={18}/> Checking BIPA...
             </Button>
          )}
          {status === 'available' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-50 rounded-lg border border-green-100">
               <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                 <CheckCircle2 size={18} /> Available
               </div>
               <p className="text-xs text-green-800 mb-3">"{name.toUpperCase()}" appears to be unique.</p>
               <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">Reserve Now (N$ 500)</Button>
            </motion.div>
          )}
          {status === 'taken' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 rounded-lg border border-red-100">
               <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
                 <XCircle size={18} /> Likely Taken
               </div>
               <p className="text-xs text-red-800">Similar names exist in the registry. Try adding "Namibia" or "Holdings".</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Tool 2: Tender Readiness Score ---
export const TenderReadinessTool = () => {
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const checklist = [
    { id: 'reg', label: 'Company Registration (Pty Ltd/CC)' },
    { id: 'tax', label: 'Good Standing (Receiver of Revenue)' },
    { id: 'ss', label: 'Good Standing (Social Security)' },
    { id: 'bipa', label: 'Good Standing (BIPA)' },
    { id: 'sme', label: 'SME Certificate' },
    { id: 'bank', label: 'Bank Confirmation Letter' },
  ];
  const [checked, setChecked] = useState<string[]>([]);

  const toggleCheck = (id: string) => {
    setChecked(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const calculate = () => {
    const s = Math.round((checked.length / checklist.length) * 100);
    setScore(s);
    setShowResult(true);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
       <div className="mb-6">
        <div className="w-10 h-10 bg-chrimson-50 rounded-lg flex items-center justify-center text-chrimson-600 mb-4">
          <Calculator size={20} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Tender Readiness</h3>
        <p className="text-slate-500 text-sm mt-2">Check if you have all the mandatory documents for a government bid.</p>
      </div>

      {!showResult ? (
        <div className="space-y-3 flex-1">
          {checklist.map(item => (
            <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-chrimson-600 focus:ring-chrimson-500 border-gray-300"
                checked={checked.includes(item.id)}
                onChange={() => toggleCheck(item.id)}
              />
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </label>
          ))}
          <Button onClick={calculate} className="w-full mt-4">Calculate Score</Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center text-center">
          <div className="w-32 h-32 mx-auto rounded-full border-8 border-slate-100 flex items-center justify-center mb-6 relative">
             <span className={`text-4xl font-bold ${score === 100 ? 'text-green-600' : score > 50 ? 'text-yellow-600' : 'text-chrimson-600'}`}>
               {score}%
             </span>
             <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" 
                  className={`${score === 100 ? 'text-green-600' : score > 50 ? 'text-yellow-500' : 'text-chrimson-600'}`}
                  strokeDasharray={`${score * 2.89} 289`}
                  strokeLinecap="round"
                />
             </svg>
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">
            {score === 100 ? 'Ready to Bid!' : 'Documents Missing'}
          </h4>
          <p className="text-sm text-slate-500 mb-6">
            {score === 100 
              ? "You have a complete compliance file. Good luck with your tender!" 
              : "You need to sort out the missing documents before submitting."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowResult(false)} className="flex-1">Back</Button>
            {score < 100 && <Button className="flex-1">Get Missing Docs</Button>}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Tool 3: Compliance Checker ---
export const ComplianceListTool = () => {
  return (
    <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-chrimson-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white mb-4 backdrop-blur-sm">
          <FileText size={20} />
        </div>
        <h3 className="text-xl font-bold text-white">Compliance Costs</h3>
        <p className="text-slate-400 text-sm mt-2">Quick reference for common document filing fees.</p>
      </div>

      <div className="space-y-0 flex-1 relative z-10">
        {[
          { name: 'Name Reservation', price: 'N$ 300' },
          { name: 'Founding Statement (CC)', price: 'N$ 500' },
          { name: 'Amended Certificate', price: 'N$ 450' },
          { name: 'Annual Duty', price: 'N$ 600+' },
          { name: 'Certificate of Good Standing', price: 'N$ 850' },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center py-4 border-b border-white/10 last:border-0">
             <span className="text-slate-300 text-sm">{item.name}</span>
             <span className="font-bold text-white">{item.price}</span>
          </div>
        ))}
      </div>
      
      <div className="pt-4 relative z-10">
        <Button variant="ghost" className="w-full text-white hover:bg-white/10 hover:text-white justify-between group">
           Full Price List <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
        </Button>
      </div>
    </div>
  );
};
