import React, { useState } from 'react';
import { usePricing } from '../../contexts/PricingContext';
import { Button } from '../../components/ui/Button';
import { db } from '../../services/mockDb';
import { 
  Save, User, Lock, Bell, Briefcase, Mail, Shield, 
  CreditCard, ToggleLeft, ToggleRight, Plus, Clock, Power,
  Trash2, AlertTriangle, ChevronRight, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceCategory } from '../../types';

export const SettingsPage: React.FC = () => {
  const { products, refreshProducts } = usePricing();
  const [activeSection, setActiveSection] = useState('general');
  const [showDeleted, setShowDeleted] = useState(false);
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<any>(null);

  const categories: ServiceCategory[] = ['Registration', 'Foreign-Owned', 'NGO', 'Regulatory', 'Compliance', 'Tourism', 'Financial'];

  const handleStartEdit = (p: any) => {
    setEditingId(p.id);
    setEditBuffer({ ...p });
  };

  const handleSaveProduct = () => {
    if (!editBuffer.category) return alert("Category is required.");
    try {
      db.updateProduct(editBuffer.id, editBuffer);
      setEditingId(null);
      refreshProducts();
      alert("Product updated!");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSoftDelete = (id: string) => {
    const hasRevenue = Math.random() > 0.5; // Simulate checking stats
    const msg = hasRevenue 
      ? "Warning: This service has generated revenue recently. Are you sure you want to disable it?" 
      : "Archive this service? It will no longer appear on the website.";
    
    if (window.confirm(msg)) {
      db.deleteProduct(id);
      refreshProducts();
    }
  };

  const visibleProducts = db.getProducts(showDeleted);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
           <p className="text-slate-500 text-sm">Manage system preferences and services.</p>
        </div>
        <div className="flex gap-2">
           {activeSection === 'services' && (
              <button 
                onClick={() => setShowDeleted(!showDeleted)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${showDeleted ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white text-slate-500 border-slate-200'}`}
              >
                 {showDeleted ? 'Hide Archived' : 'Show Archived'}
              </button>
           )}
           <Button onClick={() => alert("Global settings saved.")}>
              <Save size={16} className="mr-2"/> Save Changes
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <nav className="flex flex-col p-2 space-y-1">
                 {[
                   { id: 'general', label: 'General', icon: User },
                   { id: 'services', label: 'Services & Pricing', icon: Briefcase },
                   { id: 'security', label: 'Security', icon: Lock },
                 ].map(item => (
                   <button
                     key={item.id}
                     onClick={() => setActiveSection(item.id)}
                     className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                       activeSection === item.id ? 'bg-chrimson-50 text-chrimson-600' : 'text-slate-600 hover:bg-slate-50'
                     }`}
                   >
                     <item.icon size={18} />
                     {item.label}
                   </button>
                 ))}
              </nav>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
           
           {activeSection === 'general' && (
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><User size={18} /> Admin Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Name</label>
                      <input className="w-full input-field" defaultValue="Chrimson Admin" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Email</label>
                      <input className="w-full input-field" defaultValue="hello@chrimsoncc.com" />
                   </div>
                </div>
             </div>
           )}

           {activeSection === 'services' && (
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2"><LayoutGrid size={18} /> Product Catalog</h3>
                      <Button size="sm" variant="outline"><Plus size={14} className="mr-1" /> Add Service</Button>
                   </div>
                   
                   <div className="space-y-3">
                      {visibleProducts.map((p) => (
                        <div key={p.id} className={`p-4 rounded-xl border transition-all ${p.deleted ? 'bg-slate-100 opacity-50' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
                           {editingId === p.id ? (
                              <div className="space-y-4">
                                 <div className="grid grid-cols-2 gap-3">
                                    <input className="input-field" value={editBuffer.name} onChange={e => setEditBuffer({...editBuffer, name: e.target.value})} />
                                    <select className="input-field" value={editBuffer.category} onChange={e => setEditBuffer({...editBuffer, category: e.target.value as any})}>
                                       {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                 </div>
                                 <div className="grid grid-cols-3 gap-3">
                                    <div className="relative">
                                       <span className="absolute left-2 top-2 text-xs text-slate-400">N$</span>
                                       <input type="number" className="w-full input-field pl-8" value={editBuffer.price} onChange={e => setEditBuffer({...editBuffer, price: parseFloat(e.target.value)})} />
                                    </div>
                                    <input className="input-field" placeholder="Timeline" value={editBuffer.timeline} onChange={e => setEditBuffer({...editBuffer, timeline: e.target.value})} />
                                    <div className="flex gap-2">
                                       <Button size="sm" onClick={handleSaveProduct} className="flex-1">Save</Button>
                                       <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>X</Button>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              <div className="flex items-center justify-between">
                                 <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                       <span className="font-bold text-slate-900">{p.name}</span>
                                       <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold">{p.category}</span>
                                       {p.deleted && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase font-bold">Archived</span>}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">{p.description}</div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="text-right">
                                       <div className="text-sm font-bold text-slate-900">N$ {p.price}</div>
                                       <div className="text-[10px] text-slate-400 font-bold uppercase">{p.timeline}</div>
                                    </div>
                                    <div className="flex gap-1">
                                       {!p.deleted && (
                                          <>
                                             <button onClick={() => handleStartEdit(p)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                                <Briefcase size={16} />
                                             </button>
                                             <button onClick={() => handleSoftDelete(p.id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                             </button>
                                          </>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 flex gap-4">
                   <AlertTriangle className="text-amber-600 flex-shrink-0" size={24} />
                   <div>
                      <h4 className="text-sm font-bold text-amber-900">Service Deletion Safeguard</h4>
                      <p className="text-xs text-amber-700 mt-1">
                         Deleting a service will move it to the "Archived" state. Archived services are automatically hidden from the website but preserved in the database to prevent broken links in past orders and invoices.
                      </p>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
      
      <style>{`
        .input-field {
           @apply px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-chrimson-500/20 focus:border-chrimson-500 outline-none text-sm transition-all;
        }
      `}</style>
    </div>
  );
};