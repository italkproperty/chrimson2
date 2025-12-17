import React, { useState } from 'react';
import { db } from '../../services/mockDb';
import { Search, Mail, Phone, Building } from 'lucide-react';

export const ClientsDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const clients = db.getClients();

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div>
         <h1 className="text-2xl font-bold text-slate-900">Client Directory</h1>
         <p className="text-slate-500 text-sm">Manage your customer relationships.</p>
       </div>

       <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-chrimson-500 outline-none"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                <tr>
                   <th className="p-4">Client Name</th>
                   <th className="p-4">Contact Info</th>
                   <th className="p-4">Status</th>
                   <th className="p-4 text-right">Total Spend</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {filtered.map(client => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                     <td className="p-4">
                        <div className="font-bold text-slate-900">{client.name}</div>
                        {client.companyName && <div className="text-slate-500 text-xs flex items-center gap-1"><Building size={10}/> {client.companyName}</div>}
                     </td>
                     <td className="p-4">
                        <div className="flex flex-col gap-1 text-slate-600">
                           <span className="flex items-center gap-2"><Mail size={12}/> {client.email}</span>
                           <span className="flex items-center gap-2"><Phone size={12}/> {client.phone}</span>
                        </div>
                     </td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${client.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                           {client.status}
                        </span>
                     </td>
                     <td className="p-4 text-right font-mono text-slate-900">
                        N$ {client.totalSpend.toLocaleString()}
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};