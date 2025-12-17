import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/mockDb';
import { ArrowLeft, Calendar, User, Clock, Share2, AlertTriangle, Tag } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Default images if none provided
const STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554224155-984063584d45?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'
];

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = React.useState(db.getPostBySlug(slug || ''));
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const foundPost = db.getPostBySlug(slug || '');
      setPost(foundPost);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex justify-center items-center min-h-[50vh] bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chrimson-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center px-4 bg-white dark:bg-slate-950">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Article Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The article you are looking for does not exist or has been removed.</p>
        <Link to="/blog"><Button>Back to Blog</Button></Link>
      </div>
    );
  }

  // Defensive coding for undefined values
  const authorName = post.author || 'Chrimson Team';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const category = post.category || 'General';
  const readTime = post.readTime || '5 min read';
  const date = post.date || new Date().toISOString().split('T')[0];
  
  // Image Fallback
  const displayImage = post.imageUrl && post.imageUrl.length > 10 
    ? post.imageUrl 
    : STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)];

  return (
    <article className="pt-24 min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <Link to="/blog" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-chrimson-600 dark:hover:text-chrimson-400 mb-8 transition-colors text-sm font-medium">
           <ArrowLeft size={16} className="mr-2" /> Back to Articles
        </Link>
        
        <div className="flex gap-2 mb-6">
          <span className="bg-chrimson-50 dark:bg-chrimson-900/30 text-chrimson-700 dark:text-chrimson-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            {category}
          </span>
          {post.status !== 'published' && (
             <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
               {post.status}
             </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
          {post.title || 'Untitled Post'}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-8">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 uppercase">
               {authorInitial}
             </div>
             <span className="font-medium text-slate-900 dark:text-slate-200">{authorName}</span>
           </div>
           <div className="flex items-center gap-2">
             <Calendar size={16} /> {date}
           </div>
           <div className="flex items-center gap-2">
             <Clock size={16} /> {readTime}
           </div>
           <button className="ml-auto p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
             <Share2 size={18} />
           </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="w-full h-[400px] md:h-[500px] bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
         <img 
            src={displayImage} 
            alt={post.title || 'Cover Image'} 
            className="w-full h-full object-cover" 
            loading="eager"
         />
         {post.imageCaption && (
           <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 text-center text-xs text-white/80 italic">
             {post.imageCaption}
           </div>
         )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Safe HTML Rendering with Extended Typography Support */}
        <div 
          className="
            prose prose-lg prose-slate dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
            prose-a:text-chrimson-600 dark:prose-a:text-chrimson-400 hover:prose-a:text-chrimson-700
            prose-li:text-slate-600 dark:prose-li:text-slate-300
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8 prose-img:w-full prose-img:object-cover
            prose-blockquote:border-l-4 prose-blockquote:border-chrimson-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-table:w-full prose-table:text-left prose-table:border-collapse prose-table:my-8
            prose-th:p-4 prose-th:border-b prose-th:border-slate-200 dark:prose-th:border-slate-700 prose-th:bg-slate-50 dark:prose-th:bg-slate-800
            prose-td:p-4 prose-td:border-b prose-td:border-slate-100 dark:prose-td:border-slate-800
          "
          dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-slate-400 italic">No content available.</p>' }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium">
                <Tag size={12} className="mr-1.5" /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Box */}
        <div className="mt-16 bg-sand-50 dark:bg-slate-900 border border-sand-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Need help with {category.toLowerCase()}?</h3>
           <p className="text-slate-500 dark:text-slate-400 mb-6">Our consultants can handle the entire process for you.</p>
           <Link to="/contact">
             <Button size="lg" className="shadow-lg shadow-chrimson-500/20">Book a Free Consultation</Button>
           </Link>
        </div>
      </div>
    </article>
  );
};