import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { db } from '../../services/mockDb';
import { BlogPost, BlogContent } from '../../types';
import { Save, Eye, ArrowLeft, Image as ImageIcon, X, Loader2, Globe, Sparkles, Link as LinkIcon, Calendar, CheckCircle } from 'lucide-react';
import { GeneratedBlogResponse, translateBlogContent } from '../../services/geminiService';
import { BlogGeneratorModal } from '../../components/admin/BlogGeneratorModal';
import { useAuth } from '../../contexts/AuthContext';
import { SERVICES } from '../../constants';

type Language = 'en' | 'de' | 'pt' | 'zh';

export const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Translation State
  const [activeLang, setActiveLang] = useState<Language>('en');
  const [translating, setTranslating] = useState<Language | null>(null);

  // Core Data
  const [basePost, setBasePost] = useState<Partial<BlogPost>>({
    id: Date.now().toString(),
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    imageUrl: '',
    category: 'Compliance',
    author: user?.name || 'Admin',
    scheduledDate: ''
  });

  // Local state for current language view (to handle inputs)
  const [currentContent, setCurrentContent] = useState<BlogContent>({
    title: '',
    excerpt: '',
    content: '',
    seoTitle: '',
    seoDescription: ''
  });

  // Translations Store
  const [translations, setTranslations] = useState<{
    de?: BlogContent;
    pt?: BlogContent;
    zh?: BlogContent;
  }>({});

  // --- Load Data on Edit ---
  useEffect(() => {
    if (id) {
      const existingPost = db.getPostById(id);
      if (existingPost) {
        setBasePost(existingPost);
        setCurrentContent({
          title: existingPost.title || '',
          content: existingPost.content || '', // Ensure fallback
          excerpt: existingPost.excerpt || '',
          seoTitle: existingPost.seoTitle || '',
          seoDescription: existingPost.seoDescription || ''
        });
        setTranslations(existingPost.translations || {});
      } else {
        // ID passed but not found? Redirect back
        navigate('/admin/dashboard/blogs');
      }
    } else {
      // Check for autosave draft
      const draft = localStorage.getItem('draft_post_new');
      if (draft) {
        if (window.confirm("Found an unsaved draft. Would you like to restore it?")) {
           const parsed = JSON.parse(draft);
           setBasePost(parsed);
           setCurrentContent({
             title: parsed.title || '',
             content: parsed.content || '',
             excerpt: parsed.excerpt || '',
             seoTitle: parsed.seoTitle || '',
             seoDescription: parsed.seoDescription || ''
           });
        }
      }
    }
  }, [id, navigate]);

  // --- Autosave ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty) {
        // Save to local storage as draft
        localStorage.setItem(`draft_post_${id || 'new'}`, JSON.stringify({
          ...basePost,
          ...currentContent,
          updatedAt: new Date().toISOString()
        }));
        setLastSaved(new Date());
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isDirty, basePost, currentContent, id]);

  // --- Unsaved Changes Warning ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // --- Handlers ---

  const handleContentChange = (field: keyof BlogContent, value: string) => {
    setCurrentContent(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  // Auto-Link Internal Services
  const handleAutoLink = () => {
    let content = currentContent.content;
    let count = 0;

    SERVICES.forEach(service => {
      // Find keywords (title) that are NOT already in a link tag
      const regex = new RegExp(`(?<!<a[^>]*>)(${service.title.split('(')[0].trim()})(?![^<]*</a>)`, 'gi');
      
      if (content.match(regex)) {
        content = content.replace(regex, `<a href="/services/${service.slug}" class="text-chrimson-600 font-semibold hover:underline" title="View Service: ${service.title}">$1</a>`);
        count++;
      }
    });

    // Also check for specific acronyms
    const acronyms = [
      { key: 'Pty Ltd', slug: 'private-company-pty-ltd' },
      { key: 'NAMFISA', slug: 'namfisa-compliance' },
      { key: 'BIPA', slug: 'private-company-pty-ltd' }, 
      { key: 'NTB', slug: 'ntb-registration' }
    ];

    acronyms.forEach(ac => {
       const regex = new RegExp(`(?<!<a[^>]*>)(${ac.key})(?![^<]*</a>)`, 'g');
       if (content.match(regex)) {
         content = content.replace(regex, `<a href="/services/${ac.slug}" class="text-chrimson-600 font-semibold hover:underline" title="Learn about ${ac.key}">$1</a>`);
         count++;
       }
    });

    setCurrentContent(prev => ({ ...prev, content }));
    setIsDirty(true);
    alert(`Auto-linked ${count} keywords to internal services.`);
  };

  // When active language changes, save current buffer to the right place and load new one
  const handleLangChange = (newLang: Language) => {
    // 1. Save current input state to the store
    if (activeLang === 'en') {
      setBasePost(prev => ({ ...prev, ...currentContent }));
    } else {
      setTranslations(prev => ({ ...prev, [activeLang]: currentContent }));
    }

    // 2. Load new state
    if (newLang === 'en') {
      // Load from basePost
      setCurrentContent({
        title: basePost.title || '',
        excerpt: basePost.excerpt || '',
        content: basePost.content || '',
        seoTitle: basePost.seoTitle || '',
        seoDescription: basePost.seoDescription || ''
      });
    } else {
      // Load from translations or init empty
      const existing = translations[newLang];
      setCurrentContent(existing || {
        title: '',
        excerpt: '',
        content: '',
        seoTitle: '',
        seoDescription: ''
      });
    }

    setActiveLang(newLang);
  };

  const handleTranslate = async (targetLang: 'de' | 'pt' | 'zh') => {
    // Ensure base content is fresh
    const sourceContent = activeLang === 'en' ? currentContent : {
       title: basePost.title || '',
       content: basePost.content || '',
       excerpt: basePost.excerpt || '',
       seoTitle: basePost.seoTitle || '',
       seoDescription: basePost.seoDescription || ''
    };

    if (!sourceContent.content || sourceContent.content.trim() === '') {
      alert("Please write the English content first.");
      return;
    }

    setTranslating(targetLang);
    const translated = await translateBlogContent(sourceContent, targetLang);
    setTranslating(null);

    if (translated) {
      setTranslations(prev => ({ ...prev, [targetLang]: translated }));
      alert(`Translation to ${targetLang.toUpperCase()} complete! Switch tabs to view.`);
      setIsDirty(true);
    } else {
      alert("Translation failed.");
    }
  };

  const handleAiSuccess = (data: GeneratedBlogResponse) => {
    // Set English Content
    setBasePost(prev => ({
      ...prev,
      imageUrl: `https://source.unsplash.com/1600x900/?${encodeURIComponent(data.imageSearchTerm)}`,
      imageCaption: data.imageCaption,
      tags: data.tags
    }));

    setCurrentContent({
      title: data.title,
      content: data.content,
      excerpt: data.seoDescription, // Use meta desc as excerpt
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription
    });

    setActiveLang('en');
    setIsDirty(true);
  };

  const generateSafeSlug = (title: string): string => {
    let slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') 
      .replace(/(^-|-$)+/g, ''); 
    
    if (!slug) slug = `post-${Date.now()}`;

    // Only verify uniqueness if title changed significantly or new post
    // For simplicity, we just append timestamp if collision found
    let counter = 1;
    let originalSlug = slug;
    // Check collision but exclude self if editing
    while (db.getPostBySlug(slug) && db.getPostBySlug(slug)?.id !== basePost.id) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
    return slug;
  };

  const handleSave = (status: 'draft' | 'published' | 'scheduled') => {
    // Save current buffer first
    let finalBase = { ...basePost };
    let finalTranslations = { ...translations };

    if (activeLang === 'en') {
      finalBase = { ...finalBase, ...currentContent };
    } else {
      finalTranslations = { ...finalTranslations, [activeLang]: currentContent };
    }

    // Validation
    if (!finalBase.title) return alert('Title is required');
    if (status === 'published' && (!finalBase.content || finalBase.content.trim() === '')) {
      return alert('Content cannot be empty for published posts.');
    }
    if (status === 'scheduled' && !finalBase.scheduledDate) {
      return alert('Please select a date for the scheduled post.');
    }
    
    setLoading(true);
    
    // Only regenerate slug if new post or title changed and slug is empty
    const slug = finalBase.slug || generateSafeSlug(finalBase.title);

    const postData: BlogPost = {
      ...finalBase as BlogPost,
      id: finalBase.id || Date.now().toString(),
      slug,
      status,
      translations: finalTranslations,
      readTime: `${Math.ceil((finalBase.content?.replace(/<[^>]*>?/gm, '').split(' ').length || 0) / 200)} min read`,
      content: finalBase.content || '', 
      author: finalBase.author || user?.name || 'Chrimson Admin',
    };

    setTimeout(() => {
      if (id) {
        db.updatePost(postData);
      } else {
        db.createPost(postData);
      }
      setLoading(false);
      setIsDirty(false);
      // Remove autosave draft
      localStorage.removeItem(`draft_post_${id || 'new'}`);
      navigate('/admin/dashboard/blogs');
    }, 1000);
  };

  // Tag Handling
  const [tagInput, setTagInput] = useState('');
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = basePost.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setBasePost(prev => ({ ...prev, tags: [...currentTags, tagInput.trim()] }));
        setIsDirty(true);
      }
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => {
    setBasePost(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tag) }));
    setIsDirty(true);
  };

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => {
                if (isDirty && !window.confirm("You have unsaved changes. Leave anyway?")) return;
                navigate('/admin/dashboard/blogs');
             }} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
               <ArrowLeft size={20} />
             </button>
             <span className="text-sm font-semibold text-slate-500 hidden sm:inline">
               {currentContent.title || 'Untitled Post'} 
               <span className="text-slate-300 font-normal ml-2">{basePost.status}</span>
               {isDirty && <span className="text-amber-500 ml-2 text-xs italic">• Unsaved Changes</span>}
             </span>
          </div>
          <div className="flex items-center gap-3">
             {lastSaved && <span className="text-[10px] text-slate-400 mr-2">Autosaved {lastSaved.toLocaleTimeString()}</span>}
             <Button 
               variant="secondary" 
               size="sm" 
               className="bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
               onClick={() => setShowAiModal(true)}
             >
               <Sparkles size={16} className="mr-2" /> AI Draft
             </Button>
             <Button
               variant="outline"
               size="sm"
               onClick={handleAutoLink}
               className="text-slate-600 bg-white"
               title="Auto-link services"
             >
               <LinkIcon size={16} className="mr-2" /> Auto-Link
             </Button>
             <div className="h-6 w-px bg-slate-200 mx-2"></div>
             <Button variant="ghost" size="sm" onClick={() => handleSave('draft')} disabled={loading}>
               Save Draft
             </Button>
             <Button size="sm" onClick={() => handleSave('published')} disabled={loading}>
               {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : null}
               Publish
             </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Breadcrumbs items={[{ label: 'Blog', href: '/admin/dashboard/blogs' }, { label: 'Editor' }]} />

        {/* Language Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200">
           {(['en', 'de', 'pt', 'zh'] as Language[]).map(lang => (
             <button
               key={lang}
               onClick={() => handleLangChange(lang)}
               className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                 activeLang === lang 
                   ? 'border-chrimson-600 text-chrimson-600' 
                   : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
               }`}
             >
               {lang === 'en' ? '🇺🇸 English' : lang === 'de' ? '🇩🇪 Deutsch' : lang === 'pt' ? '🇦🇴 Português' : '🇨🇳 中文'}
               {lang !== 'en' && !translations[lang] && <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>}
             </button>
           ))}
           <div className="ml-auto flex gap-2">
              {activeLang === 'en' && (
                 <>
                   <Button variant="ghost" size="sm" onClick={() => handleTranslate('de')} disabled={!!translating}>
                      {translating === 'de' ? <Loader2 className="animate-spin" size={14}/> : 'Translate DE'}
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => handleTranslate('pt')} disabled={!!translating}>
                      {translating === 'pt' ? <Loader2 className="animate-spin" size={14}/> : 'Translate PT'}
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => handleTranslate('zh')} disabled={!!translating}>
                      {translating === 'zh' ? <Loader2 className="animate-spin" size={14}/> : 'Translate ZH'}
                   </Button>
                 </>
              )}
           </div>
        </div>

        {/* Main Editor Area */}
        <div className="space-y-8">
           
           {/* Title Input */}
           <input 
             type="text" 
             placeholder="Enter article title..."
             className="w-full text-4xl font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
             value={currentContent.title}
             onChange={e => handleContentChange('title', e.target.value)}
           />

           {/* Metadata Grid (Shared for EN, mostly hidden for others unless specific override needed) */}
           {activeLang === 'en' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                   <select 
                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-chrimson-500 outline-none text-slate-900"
                     value={basePost.category}
                     onChange={e => { setBasePost({...basePost, category: e.target.value}); setIsDirty(true); }}
                   >
                      <option>Compliance</option>
                      <option>Registration</option>
                      <option>Financial Services</option>
                      <option>Tourism</option>
                      <option>Tenders</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Cover Image URL</label>
                   <div className="flex gap-2">
                      <input 
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-chrimson-500 outline-none text-slate-900"
                        value={basePost.imageUrl}
                        onChange={e => { setBasePost({...basePost, imageUrl: e.target.value}); setIsDirty(true); }}
                        placeholder="https://..."
                      />
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
                         {basePost.imageUrl ? <img src={basePost.imageUrl} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon size={18} />}
                      </div>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Schedule Publish (Optional)</label>
                   <div className="flex items-center gap-2">
                      <input 
                        type="date"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-chrimson-500 outline-none text-slate-900"
                        value={basePost.scheduledDate || ''}
                        onChange={e => { setBasePost({...basePost, scheduledDate: e.target.value}); setIsDirty(true); }}
                      />
                      {basePost.scheduledDate && (
                        <Button size="sm" onClick={() => handleSave('scheduled')}>Schedule</Button>
                      )}
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Tags</label>
                   <div className="flex flex-wrap gap-2 mb-2">
                      {(basePost.tags || []).map(tag => (
                        <span key={tag} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-xs font-medium text-slate-600 flex items-center gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-600">×</button>
                        </span>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {/* Excerpt */}
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Excerpt</label>
             <textarea 
               className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-chrimson-500 outline-none text-slate-900"
               rows={3}
               value={currentContent.excerpt}
               onChange={e => handleContentChange('excerpt', e.target.value)}
               placeholder="Brief summary of the article..."
             />
           </div>

           {/* Content */}
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Content</label>
             <RichTextEditor 
               value={currentContent.content}
               onChange={value => handleContentChange('content', value)}
             />
           </div>
        </div>
      </div>

      {/* AI Generator Modal */}
      <BlogGeneratorModal 
        isOpen={showAiModal} 
        onClose={() => setShowAiModal(false)} 
        onGenerate={handleAiGenerate}
      />
    </div>
  );
};