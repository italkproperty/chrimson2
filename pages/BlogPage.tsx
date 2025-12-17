import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../services/mockDb';
import { Search, Tag, Clock, ChevronRight } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts] = useState(db.getPosts().filter(p => p.status === 'published'));

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-24 min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-chrimson-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Business Insights</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Expert advice on compliance, tenders, and growing your Namibian enterprise.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-chrimson-500 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             {['All', 'Compliance', 'Tenders', 'Financial Services'].map(cat => (
               <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-slate-200 hover:border-chrimson-500 hover:text-chrimson-600 transition-colors whitespace-nowrap">
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-chrimson-900/5 transition-all duration-300 h-full flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                   <img src={post.imageUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-chrimson-700 uppercase tracking-wide">
                     {post.category}
                   </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <Clock size={12} /> {post.readTime}
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-chrimson-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-chrimson-600 font-semibold text-sm">
                    Read Article <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};