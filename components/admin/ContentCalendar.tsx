import React, { useState } from 'react';
import { db } from '../../services/mockDb';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ContentCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const posts = db.getPosts();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Create grid
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.date === dateStr || p.scheduledDate === dateStr);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <Calendar size={20} className="text-chrimson-600"/> Content Calendar
           </h2>
           <p className="text-sm text-slate-500">Plan and schedule your publications.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center bg-slate-50 rounded-lg p-1">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"><ChevronLeft size={16}/></button>
              <span className="w-32 text-center font-bold text-slate-900 text-sm">{monthName} {year}</span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"><ChevronRight size={16}/></button>
           </div>
           <Button size="sm" onClick={() => navigate('/admin/dashboard/blogs/new')}><Plus size={16} className="mr-2"/> New Post</Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[120px]">
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="bg-slate-50/30 border-r border-b border-slate-100"></div>;
          
          const dayPosts = getPostsForDay(day);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

          return (
            <div key={day} className={`border-r border-b border-slate-100 p-2 relative group hover:bg-slate-50/50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
               <span className={`text-xs font-semibold ${isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                 {day}
               </span>
               
               <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {dayPosts.map(post => (
                    <div 
                      key={post.id} 
                      onClick={() => navigate('/admin/dashboard/blogs/new')}
                      className={`text-[10px] p-1.5 rounded border truncate cursor-pointer transition-all ${
                        post.status === 'published' 
                          ? 'bg-green-50 border-green-100 text-green-700 hover:border-green-300' 
                          : post.status === 'scheduled'
                            ? 'bg-purple-50 border-purple-100 text-purple-700 hover:border-purple-300'
                            : 'bg-amber-50 border-amber-100 text-amber-700 hover:border-amber-300'
                      }`}
                    >
                       <span className="font-bold mr-1">•</span> {post.title}
                    </div>
                  ))}
               </div>

               <button 
                 onClick={() => navigate('/admin/dashboard/blogs/new')}
                 className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-chrimson-600 hover:border-chrimson-200 shadow-sm transition-all"
               >
                 <Plus size={14} />
               </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};