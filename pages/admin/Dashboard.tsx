import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/mockDb';
import { Logo } from '../../components/ui/Logo';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { RegistrationTracker } from './RegistrationTracker';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ClientsDirectory } from './ClientsDirectory';
import { SettingsPage } from './SettingsPage';
import { ContentCalendar } from '../../components/admin/ContentCalendar';
import { 
  LayoutGrid, 
  FileText, 
  Receipt, 
  Settings as SettingsIcon, 
  LogOut, 
  Users,
  CheckSquare,
  BarChart3,
  ChevronRight,
  FileSpreadsheet,
  Plus,
  Globe,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { FinancialDoc } from '../../types';

// --- Types ---
type TabType = 'analytics' | 'invoices' | 'quotations' | 'projects' | 'clients' | 'blog' | 'calendar' | 'tasks' | 'settings';

interface DashboardProps {
  defaultTab?: TabType;
}

// --- List View Components ---

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    paid: 'bg-green-50 text-green-700 border-green-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    overdue: 'bg-red-50 text-red-700 border-red-100',
    sent: 'bg-blue-50 text-blue-700 border-blue-100',
    accepted: 'bg-green-50 text-green-700 border-green-100',
    rejected: 'bg-red-50 text-red-700 border-red-100',
    draft: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
};

const FinancialList: React.FC<{ type: 'invoice' | 'quotation' }> = ({ type }) => {
  const navigate = useNavigate();
  const docs = db.getFinancialDocs().filter(d => d.type === type);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 capitalize">{type}s</h2>
           <p className="text-slate-500 text-sm">Manage your {type} documents.</p>
        </div>
        <Button onClick={() => navigate(`/admin/dashboard/${type}s/new`)}>
           <Plus size={16} className="mr-2"/> Create {type === 'invoice' ? 'Invoice' : 'Quotation'}
        </Button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {docs.length === 0 ? (
           <div className="p-12 text-center text-slate-500">
              <p>No {type}s found. Create one to get started.</p>
           </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase">
              <tr>
                 <th className="p-4">Number</th>
                 <th className="p-4">Client</th>
                 <th className="p-4">Date</th>
                 <th className="p-4">Total</th>
                 <th className="p-4">Status</th>
                 <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {docs.map(doc => (
                 <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-medium text-slate-700">{doc.number}</td>
                    <td className="p-4 font-bold text-slate-900">{doc.clientName}</td>
                    <td className="p-4 text-slate-500">{doc.issueDate}</td>
                    <td className="p-4 text-slate-900 font-mono">
                       {doc.currency} {doc.total.toLocaleString()}
                    </td>
                    <td className="p-4">
                       <StatusBadge status={doc.status} />
                    </td>
                    <td className="p-4 text-right">
                       <Button variant="ghost" size="sm">View</Button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- Blog Module Wrapper ---
const BlogModuleWrapper = () => {
   const navigate = useNavigate();
   const posts = db.getPosts();
   
   const handleDelete = (id: string) => {
     if (window.confirm("Are you sure you want to delete this post?")) {
        db.deletePost(id);
        // Force refresh via navigate trick or better state management, 
        // but for now simple refresh is okay as component re-renders on route change
        navigate('/admin/dashboard/blogs'); 
     }
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">Blog Posts</h2>
            <Button onClick={() => navigate('/admin/dashboard/blogs/new')}>New Post</Button>
         </div>
         <div className="grid gap-4">
            {posts.map(post => (
               <div key={post.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:shadow-sm transition-shadow">
                  <div>
                     <h3 className="font-bold text-slate-900">{post.title}</h3>
                     <div className="flex gap-2 items-center mt-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${post.status === 'published' ? 'bg-green-100 text-green-700' : post.status === 'scheduled' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{post.status}</span>
                        <span className="text-xs text-slate-500">{post.date}</span>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/dashboard/blogs/edit/${post.id}`)}>Edit</Button>
                     <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">Delete</Button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

// --- Main Dashboard Layout ---

export const Dashboard: React.FC<DashboardProps> = ({ defaultTab = 'analytics' }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const routes: Record<TabType, string> = {
       analytics: '/admin/dashboard',
       invoices: '/admin/dashboard/invoices',
       quotations: '/admin/dashboard/quotations',
       projects: '/admin/dashboard/projects',
       clients: '/admin/dashboard/clients',
       blog: '/admin/dashboard/blogs',
       calendar: '/admin/dashboard/calendar',
       tasks: '/admin/dashboard/tasks',
       settings: '/admin/dashboard/settings'
    };
    if (routes[tab]) navigate(routes[tab]);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: TabType, icon: any, label: string }) => (
    <button 
      onClick={() => handleTabChange(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group ${
        activeTab === id 
          ? 'bg-slate-900 text-white shadow-md' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={18} className={`transition-colors ${activeTab === id ? 'text-chrimson-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className="flex-1 text-left">{label}</span>
      {activeTab === id && <ChevronRight size={14} className="text-slate-500"/>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
           <Logo className="h-8" />
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
           <div className="space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Overview</p>
              <NavItem id="analytics" icon={BarChart3} label="Analytics" />
              <NavItem id="projects" icon={LayoutGrid} label="Registrations" />
              <NavItem id="tasks" icon={CheckSquare} label="Tasks" />
           </div>

           <div className="space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Financials</p>
              <NavItem id="invoices" icon={Receipt} label="Invoices" />
              <NavItem id="quotations" icon={FileSpreadsheet} label="Quotations" />
           </div>

           <div className="space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Business</p>
              <NavItem id="clients" icon={Users} label="Clients" />
              <NavItem id="blog" icon={FileText} label="Content & SEO" />
              <NavItem id="calendar" icon={CalendarDays} label="Calendar" />
           </div>
           
           <div className="space-y-1">
               <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System</p>
               <NavItem id="settings" icon={SettingsIcon} label="Settings" />
           </div>
        </div>

        <div className="px-3 pb-3">
           <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all">
              <Globe size={18} /> Back to Website
           </Link>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
             <div className="w-9 h-9 rounded-full bg-chrimson-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
               {(user?.name || 'A').charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-bold text-slate-900 truncate group-hover:text-chrimson-700">{user?.name || 'User'}</p>
               <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">Administrator</p>
             </div>
             <button onClick={logout} className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
               <LogOut size={16} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto max-w-[1600px]">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-30">
           <Logo className="h-6"/>
           <button onClick={logout}><LogOut size={18} className="text-slate-500"/></button>
        </div>

        <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="min-h-[80vh]"
             >
                {activeTab === 'analytics' && <AnalyticsDashboard />}
                {activeTab === 'projects' && <RegistrationTracker />}
                {activeTab === 'invoices' && <FinancialList type="invoice" />}
                {activeTab === 'quotations' && <FinancialList type="quotation" />}
                {activeTab === 'clients' && <ClientsDirectory />}
                {activeTab === 'blog' && <BlogModuleWrapper />}
                {activeTab === 'calendar' && <ContentCalendar />}
                {activeTab === 'tasks' && <div className="p-12 text-center text-slate-400">Task Manager Coming Soon</div>}
                {activeTab === 'settings' && <SettingsPage />}
             </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};