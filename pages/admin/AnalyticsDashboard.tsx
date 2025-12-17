import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { TrendingUp, Users, FileCheck, DollarSign, MousePointer, ShieldCheck, Save, Plus, Trash2, LayoutPanelLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { TrustConfig, CaseSnippet } from '../../types';

const StatCard = ({ label, value, trend, icon: Icon, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
  >
     <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-chrimson-50 text-chrimson-600 flex items-center justify-center">
           <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
             {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
     </div>
     <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
     <p className="text-slate-500 text-xs uppercase font-semibold">{label}</p>
  </motion.div>
);

const FunnelStep = ({ label, count, percentage, dropoff, colorClass }: any) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-end">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-slate-900">{count}</span>
    </div>
    <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
      <div className={`h-full ${colorClass} transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
    </div>
    <div className="flex justify-between text-[10px] font-medium text-slate-400 px-1">
      <span>{percentage}% of total</span>
      {dropoff > 0 && <span className="text-red-500">-{dropoff}% drop-off</span>}
    </div>
  </div>
);

export const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'funnel' | 'trust'>('funnel');
  const [trustConfig, setTrustConfig] = useState<TrustConfig>(db.getTrustConfig());
  const [analytics, setAnalytics] = useState(db.getAnalytics());
  const finStats = db.getFinancialStats();

  const handleSaveTrust = () => {
    db.updateTrustConfig(trustConfig);
    alert('Trust settings saved successfully.');
  };

  const addSnippet = () => {
    const newSnippet = db.addCaseSnippet({ businessType: 'Entity', outcome: 'Description', timeframe: '7 days' });
    setTrustConfig({ ...trustConfig, caseSnippets: [...trustConfig.caseSnippets, newSnippet] });
  };

  const removeSnippet = (id: string) => {
    db.deleteCaseSnippet(id);
    setTrustConfig({ ...trustConfig, caseSnippets: trustConfig.caseSnippets.filter(s => s.id !== id) });
  };

  const updateSnippet = (id: string, field: keyof CaseSnippet, value: string) => {
    db.updateCaseSnippet(id, { [field]: value });
    setTrustConfig({
      ...trustConfig,
      caseSnippets: trustConfig.caseSnippets.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  // Funnel Data Processing
  const views = analytics.filter(e => e.type === 'page_view').length;
  const starts = analytics.filter(e => e.type === 'start_registration').length;
  const orders = analytics.filter(e => e.type === 'order_completed').length;
  
  const startRate = views > 0 ? Math.round((starts / views) * 100) : 0;
  const orderRate = starts > 0 ? Math.round((orders / starts) * 100) : 0;
  const totalRate = views > 0 ? ((orders / views) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
       <header className="flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-bold text-slate-900">Performance & CRO</h1>
           <p className="text-slate-500 text-sm">Monitor conversion funnels and social proof signals.</p>
         </div>
         <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('funnel')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'funnel' ? 'bg-white text-chrimson-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Funnel
            </button>
            <button 
              onClick={() => setActiveTab('trust')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'trust' ? 'bg-white text-chrimson-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Trust signals
            </button>
         </div>
       </header>

       {activeTab === 'funnel' && (
         <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Revenue" value={`N$ ${finStats.revenue.toLocaleString()}`} icon={DollarSign} trend={12} delay={0} />
                <StatCard label="Total Visitors" value={views} icon={Users} delay={0.1} />
                <StatCard label="Conversions" value={orders} icon={FileCheck} trend={5} delay={0.2} />
                <StatCard label="Conversion Rate" value={`${totalRate}%`} icon={TrendingUp} trend={2} delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Visual Funnel */}
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
                     <LayoutPanelLeft size={18} className="text-chrimson-600" />
                     Registration Funnel
                  </h3>
                  <div className="space-y-10">
                     <FunnelStep label="Landing Page Visits" count={views} percentage={100} dropoff={0} colorClass="bg-blue-500" />
                     <FunnelStep label="Start Registration" count={starts} percentage={startRate} dropoff={100 - startRate} colorClass="bg-purple-500" />
                     <FunnelStep label="Order Completed" count={orders} percentage={Math.round((orders/views)*100)} dropoff={100 - orderRate} colorClass="bg-green-500" />
                  </div>
               </div>

               {/* Top Performing Pages (Mock) */}
               <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                     <MousePointer size={18} className="text-chrimson-600" />
                     Revenue-Driving Pages
                  </h3>
                  <div className="space-y-4">
                     {[
                        { path: '/services/private-company-pty-ltd', revenue: 'N$ 45,200', conv: '4.2%' },
                        { path: '/blog/pty-ltd-vs-cc-tenders', revenue: 'N$ 12,800', conv: '1.8%' },
                        { path: '/services/namfisa-compliance', revenue: 'N$ 8,500', conv: '2.1%' },
                        { path: '/services/close-corporation-cc', revenue: 'N$ 5,400', conv: '3.5%' }
                     ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 transition-colors">
                           <div>
                              <div className="text-sm font-medium text-slate-900">{row.path}</div>
                              <div className="text-xs text-slate-500">Conv: {row.conv}</div>
                           </div>
                           <div className="text-sm font-bold text-chrimson-700">{row.revenue}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
       )}

       {activeTab === 'trust' && (
         <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                     <ShieldCheck className="text-chrimson-600" />
                     Trust Signals Configuration
                  </h3>
                  <Button onClick={handleSaveTrust} size="sm">
                     <Save size={16} className="mr-2" /> Save Configuration
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">"Trusted By" Counter</label>
                     <div className="flex items-center gap-4">
                        <input 
                           type="number" 
                           className="w-32 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 outline-none focus:ring-2 focus:ring-chrimson-500"
                           value={trustConfig.trustedCount}
                           onChange={e => setTrustConfig({ ...trustConfig, trustedCount: parseInt(e.target.value) || 0 })}
                        />
                        <span className="text-sm text-slate-500">+ Businesses in Namibia</span>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institutional Proof</label>
                     <div className="flex items-center gap-3">
                        <button 
                           onClick={() => setTrustConfig({ ...trustConfig, showAuthorityLogos: !trustConfig.showAuthorityLogos })}
                           className={`w-12 h-6 rounded-full p-1 transition-colors ${trustConfig.showAuthorityLogos ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                           <div className={`w-4 h-4 bg-white rounded-full transition-transform ${trustConfig.showAuthorityLogos ? 'translate-x-6' : ''}`}></div>
                        </button>
                        <span className="text-sm text-slate-600">Display BIPA, NAMRA, SSC references</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Rotating Case Snippets</h4>
                     <Button variant="ghost" size="sm" onClick={addSnippet}>
                        <Plus size={16} className="mr-1" /> Add Snippet
                     </Button>
                  </div>
                  <div className="space-y-3">
                     {trustConfig.caseSnippets.map((snippet) => (
                        <div key={snippet.id} className="grid grid-cols-12 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                           <div className="col-span-3">
                              <input 
                                 className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                                 placeholder="Business Type"
                                 value={snippet.businessType}
                                 onChange={e => updateSnippet(snippet.id, 'businessType', e.target.value)}
                              />
                           </div>
                           <div className="col-span-6">
                              <input 
                                 className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                                 placeholder="Outcome"
                                 value={snippet.outcome}
                                 onChange={e => updateSnippet(snippet.id, 'outcome', e.target.value)}
                              />
                           </div>
                           <div className="col-span-2">
                              <input 
                                 className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                                 placeholder="Timeframe"
                                 value={snippet.timeframe}
                                 onChange={e => updateSnippet(snippet.id, 'timeframe', e.target.value)}
                              />
                           </div>
                           <div className="col-span-1 flex justify-end">
                              <button onClick={() => removeSnippet(snippet.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};