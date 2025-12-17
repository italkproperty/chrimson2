import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/mockDb';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/Button';

export const BlogPreview: React.FC = () => {
  const posts = db.getPosts().filter(p => p.status === 'published').slice(0, 3);

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Latest Insights</h2>
            <p className="text-lg text-slate-500">
              Stay updated with the latest compliance news, tender tips, and business advice.
            </p>
          </div>
          <Link to="/blog" className="hidden md:block">
            <Button variant="ghost" className="text-chrimson-600 hover:text-chrimson-700 group">
              View All Articles <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group h-full">
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-chrimson-900/5 transition-all duration-300 h-full flex flex-col"
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
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-chrimson-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="text-chrimson-600 font-semibold text-sm flex items-center mt-auto">
                    Read Article <ArrowRight size={16} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/blog">
            <Button variant="outline" className="w-full">View All Articles</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};