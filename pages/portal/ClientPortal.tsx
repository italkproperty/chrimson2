import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../services/mockDb';
import { Client, RegistrationProject, FinancialDoc } from '../../types';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { 
  LayoutDashboard, FileText, CreditCard, Bell, LogOut, 
  CheckCircle2, Clock, AlertCircle, Download, Upload, ChevronRight, Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ClientPortal: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<{ client?: Client, projects: RegistrationProject[], invoices: FinancialDoc[] } | null>(null);

  useEffect(() => {
    if (clientId) {
        const portalData = db.getPortalData(clientId);
        setData(portalData);
    }
  }, [clientId]);

  if (!data?.client) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="text-center">
                  <h2 className="text-xl font-bold text-slate-900">Portal Access Denied</h2>
                  <p className="text-slate-500 mb-4">We couldn't find your client record.</p>
                  <Link to="/"><Button>Return Home</Button></Link>
              </div>
          </div>
      );
  }

  const { client, projects, invoices } = data;
  const activeProject = projects[0]; // Assume most recent for demo

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-slate-900 flex flex-col md:flex-row">
       
       {/* Sidebar */}
       <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col z-20">
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
             <Logo className="h-8" />
             <span className="ml-2 text-[10px] bg-chrimson-100 text-chrimson-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Client</span>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
             <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'overview' ? 'bg-chrimson-50 text-chrimson-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                <LayoutDashboard size={18} /> Overview
             </button>
             <button onClick={() => setActiveTab('documents')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'documents' ? 'bg-chrimson-50 text-chrimson-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                <FileText size={18} /> Documents
             </button>
             <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'billing' ? 'bg-chrimson-50 text-chrimson-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                <CreditCard size={18} /> Billing
             </button>
          </div>

          <div className="p-4 border-t border-slate-100">
             <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                   {(client.name || 'C').charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-sm font-bold text-slate-900 truncate">{client.name}</p>
                   <p className="text-xs text-slate-500 truncate">{client.email}</p>
                </div>
             </div>
             <Link to="/">
                <button className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-900 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                   <LogOut size={16} /> Sign Out
                </button>
             </Link>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
             
             {/* Header */}
             <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h1 className="text-2xl font-bold text-slate-900">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {(client.name || 'Client').split(' ')[0]}</h1>
                   <p className="text-slate-500 text-sm">Welcome to your client portal.</p>
                </div>
                <div className="flex items-center gap-4">
                   <button className="relative p-2 text-slate-400 hover:text-chrimson-600 transition-colors">
                      <Bell size={20} />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                   </button>
                   <Button size="sm">New Request</Button>
                </div>
             </header>

             {/* Tab Content */}
             <div className="space-y-6">
                
                {activeTab === 'overview' && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      
                      {/* Active Project Card */}
                      {activeProject ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <div className="text-xs font-bold text-chrimson-600 uppercase tracking-wide mb-1">Active Registration</div>
                                 <h2 className="text-xl font-bold text-slate-900">{activeProject.serviceType} - {activeProject.reference}</h2>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${activeProject.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                 {activeProject.status.replace('_', ' ')}
                              </span>
                           </div>

                           {/* Progress Bar */}
                           <div className="mb-8">
                              <div className="flex justify-between text-sm mb-2">
                                 <span className="font-semibold text-slate-700">Progress</span>
                                 <span className="font-bold text-slate-900">{activeProject.progress}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-chrimson-600 rounded-full transition-all duration-1000" style={{ width: `${activeProject.progress}%` }}></div>
                              </div>
                           </div>

                           {/* Stages */}
                           <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                              {/* Connector Line (Desktop) */}
                              <div className="hidden md:block absolute top-3 left-0 right-0 h-0.5 bg-slate-100 -z-10"></div>
                              
                              {activeProject.stages.map((stage, idx) => {
                                 const isCompleted = stage.completed;
                                 const isCurrent = !stage.completed && (idx === 0 || activeProject.stages[idx-1].completed);
                                 
                                 return (
                                    <div key={idx} className="flex flex-row md:flex-col items-center gap-3 md:gap-2">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 border-2 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : isCurrent ? 'bg-white border-chrimson-600 text-chrimson-600' : 'bg-white border-slate-200 text-slate-300'}`}>
                                          {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                                       </div>
                                       <div className={`text-sm md:text-center ${isCompleted ? 'text-slate-900 font-medium' : isCurrent ? 'text-chrimson-700 font-bold' : 'text-slate-400'}`}>
                                          {stage.label}
                                       </div>
                                    </div>
                                 )
                              })}
                           </div>
                        </div>
                      ) : (
                        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                           No active registrations found.
                        </div>
                      )}

                      {/* Notifications / Next Steps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                               <AlertCircle size={18} className="text-amber-500" /> Action Required
                            </h3>
                            {activeProject?.status === 'pending' ? (
                               <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
                                  <strong>Payment Pending:</strong> Please upload your proof of payment to proceed to the next step.
                                  <Button size="sm" className="mt-3 w-full bg-amber-600 hover:bg-amber-700 border-none">Upload Proof</Button>
                               </div>
                            ) : (
                               <p className="text-slate-500 text-sm">No pending actions. We are processing your documents.</p>
                            )}
                         </div>

                         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                               <Bell size={18} className="text-slate-400" /> Recent Updates
                            </h3>
                            <div className="space-y-4">
                               <div className="flex gap-3 text-sm">
                                  <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                                  <div>
                                     <p className="text-slate-900 font-medium">Order Received</p>
                                     <p className="text-slate-500 text-xs">Your registration order #{activeProject?.reference} has been received.</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                   </motion.div>
                )}

                {activeTab === 'documents' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                         <h3 className="font-bold text-slate-800">My Documents</h3>
                         <Button size="sm" variant="outline" className="bg-white"><Upload size={14} className="mr-2"/> Upload New</Button>
                      </div>
                      <div className="divide-y divide-slate-100">
                         {/* Mock Docs */}
                         {['ID Copy', 'Proof of Address'].map((doc, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                     <FileText size={20} />
                                  </div>
                                  <div>
                                     <p className="font-medium text-slate-900">{doc}.pdf</p>
                                     <p className="text-xs text-slate-500">Uploaded on {new Date().toLocaleDateString()}</p>
                                  </div>
                               </div>
                               <button className="p-2 text-slate-400 hover:text-chrimson-600"><Download size={18} /></button>
                            </div>
                         ))}
                         {/* Locked Doc */}
                         <div className="p-4 flex items-center justify-between bg-slate-50/50">
                               <div className="flex items-center gap-3 opacity-50">
                                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                     <Lock size={20} />
                                  </div>
                                  <div>
                                     <p className="font-medium text-slate-700">Certificate of Incorporation</p>
                                     <p className="text-xs text-slate-500">Pending BIPA Approval</p>
                                  </div>
                               </div>
                            </div>
                      </div>
                   </motion.div>
                )}

                {activeTab === 'billing' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {invoices.map(inv => (
                         <div key={inv.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono font-bold text-slate-900">{inv.number}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                     {inv.status}
                                  </span>
                               </div>
                               <p className="text-sm text-slate-500">Issued {inv.issueDate} • Due {inv.dueDate}</p>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="text-right">
                                  <p className="text-xs text-slate-400 uppercase font-bold">Total</p>
                                  <p className="text-xl font-bold text-slate-900">{inv.currency} {inv.total.toLocaleString()}</p>
                               </div>
                               <Button variant="outline" size="sm" className="bg-white">
                                  <Download size={16} className="mr-2" /> Invoice
                               </Button>
                            </div>
                         </div>
                      ))}
                   </motion.div>
                )}

             </div>

          </div>
       </main>
    </div>
  );
};