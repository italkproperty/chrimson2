import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { db } from '../../services/mockDb';
import { RegistrationProject } from '../../types';
import { 
  Plus, Search, Filter, MoreHorizontal, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, FileText, Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RegistrationTracker: React.FC = () => {
  const [projects] = useState(db.getProjects());
  const [filter, setFilter] = useState('all');

  // Helpers
  const getStatusColor = (status: RegistrationProject['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'waiting_client': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityColor = (p: string) => {
    if(p === 'high') return 'text-red-600 bg-red-50';
    if(p === 'medium') return 'text-amber-600 bg-amber-50';
    return 'text-slate-500 bg-slate-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Registration Tracker</h1>
           <p className="text-slate-500 text-sm">Monitor business registration progress and deadlines.</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2"/> New Project
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 pb-4 border-b border-slate-200">
         {['All', 'In Progress', 'Waiting Client', 'Completed'].map(f => (
           <button 
             key={f}
             onClick={() => setFilter(f.toLowerCase().replace(' ', '_'))}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
               filter === f.toLowerCase().replace(' ', '_') || (f === 'All' && filter === 'all')
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
             }`}
           >
             {f}
           </button>
         ))}
      </div>

      {/* Kanban / List Hybrid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {projects.filter(p => filter === 'all' || p.status === filter).map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                 
                 {/* Left: Info */}
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                       </span>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(project.priority)}`}>
                          {project.priority} Priority
                       </span>
                       <span className="text-xs text-slate-400 font-mono">{project.reference}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{project.clientName}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                       <span className="flex items-center gap-1"><FileText size={14}/> {project.serviceType}</span>
                       <span className="flex items-center gap-1"><Calendar size={14}/> Started {project.startDate}</span>
                    </div>
                 </div>

                 {/* Middle: Progress */}
                 <div className="w-full md:w-1/3">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                       <span>Progress</span>
                       <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-chrimson-500 to-chrimson-600" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 truncate">
                       Next: {project.stages.find(s => !s.completed)?.label || 'Complete'}
                    </div>
                 </div>

                 {/* Right: Actions */}
                 <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 mr-4">
                       <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 uppercase" title={`Assigned to ${project.assignedTo}`}>
                          {(project.assignedTo || 'U').charAt(0)}
                       </div>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                       <MoreHorizontal size={20} />
                    </button>
                    <div className="p-2 rounded-full bg-slate-50 text-slate-300 group-hover:bg-chrimson-50 group-hover:text-chrimson-600 transition-colors">
                       <ChevronRight size={20} />
                    </div>
                 </div>

              </div>
              
              {/* Detailed Stages (Optional expansion logic could go here) */}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};