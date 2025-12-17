import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertTriangle, Clock, FileText, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = SERVICES.find(s => s.slug === slug);

  // Fallback to services page if not found
  useEffect(() => {
    if (!service) {
      navigate('/services');
    }
    window.scrollTo(0, 0);
  }, [service, navigate]);

  if (!service || !service.fullContent) return null;

  const { fullContent } = service;

  // SEO Update (Simulated)
  useEffect(() => {
    if (service.seo) {
      document.title = service.seo.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', service.seo.description);
    }
  }, [service]);

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-24 overflow-hidden">
        {service.heroImage && (
          <div className="absolute inset-0 z-0">
             <img src={service.heroImage} alt={service.title} className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900"></div>
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm font-medium">
             <ArrowLeft size={16} className="mr-2" /> Back to Services
          </Link>
          
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chrimson-500/10 border border-chrimson-500/20 text-chrimson-400 text-xs font-bold uppercase tracking-wider mb-6"
            >
               <span className="w-2 h-2 rounded-full bg-chrimson-500"></span> Expert Advice
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              {service.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 leading-relaxed"
            >
              {service.shortSummary}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
               <Button size="lg" onClick={() => navigate('/order')} className="bg-chrimson-600 hover:bg-chrimson-700 border-none">
                 Start Registration
               </Button>
               <Button size="lg" variant="outline" onClick={() => document.getElementById('content-start')?.scrollIntoView({ behavior: 'smooth' })} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                 Read Full Guide
               </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <div id="content-start" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-16">
           
           {/* Section 1: Definition */}
           <Reveal>
             <div className="prose prose-lg prose-slate max-w-none">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                   <BookOpen className="text-chrimson-600" /> What is a {service.title}?
                </h2>
                <ReactMarkdown>{fullContent.definition}</ReactMarkdown>
             </div>
           </Reveal>

           {/* Section 2: Who is it for? */}
           <Reveal>
             <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Who is this best for?</h3>
                <ul className="space-y-4">
                   {fullContent.whoIsItFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                         <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <CheckCircle2 size={14} />
                         </div>
                         <span className="text-slate-700">{item}</span>
                      </li>
                   ))}
                </ul>
             </div>
           </Reveal>

           {/* Section 3: Advantages & Limitations */}
           <div className="grid md:grid-cols-2 gap-8">
              <Reveal>
                 <h3 className="text-xl font-bold text-slate-900 mb-4 text-green-700">Key Advantages</h3>
                 <ul className="space-y-3">
                    {fullContent.advantages.map((adv, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <CheckCircle2 size={16} className="mt-1 flex-shrink-0 text-green-500" />
                          <ReactMarkdown components={{ p: 'span' }}>{adv}</ReactMarkdown>
                       </li>
                    ))}
                 </ul>
              </Reveal>
              <Reveal delay={0.1}>
                 <h3 className="text-xl font-bold text-slate-900 mb-4 text-red-700">Limitations</h3>
                 <ul className="space-y-3">
                    {fullContent.limitations.map((lim, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <AlertTriangle size={16} className="mt-1 flex-shrink-0 text-red-500" />
                          <ReactMarkdown components={{ p: 'span' }}>{lim}</ReactMarkdown>
                       </li>
                    ))}
                 </ul>
              </Reveal>
           </div>

           {/* Section 4: Requirements */}
           <Reveal>
              <div className="border-l-4 border-chrimson-600 pl-6 py-2">
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">Registration Requirements</h3>
                 <p className="text-slate-600 mb-4">To proceed with Chrimson, you will need to provide:</p>
                 <ul className="space-y-2">
                    {fullContent.requirements.map((req, i) => (
                       <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                          <FileText size={16} className="text-slate-400" /> {req}
                       </li>
                    ))}
                 </ul>
              </div>
           </Reveal>

           {/* Section 5: Compliance & Chrimson Value */}
           <Reveal>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Ongoing Compliance</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">{fullContent.compliance}</p>
              
              <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-chrimson-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                       <ShieldCheck className="text-chrimson-500" /> Why Choose Chrimson?
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-6">
                       {fullContent.whyChrimson}
                    </p>
                    <Button onClick={() => navigate('/order')} className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100">
                       Get Started Now <ArrowRight size={16} className="ml-2" />
                    </Button>
                 </div>
              </div>
           </Reveal>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Summary Card */}
           <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">At a Glance</h4>
                 
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Clock size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Timeline</p>
                          <p className="font-semibold text-slate-900">7 - 14 Working Days</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                          <FileText size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Deliverables</p>
                          <p className="font-semibold text-slate-900">Full Registration Pack</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Support</p>
                          <p className="font-semibold text-slate-900">1 Year Advisory</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-100">
                    <Button onClick={() => navigate('/contact')} variant="outline" className="w-full justify-center mb-3">
                       Talk to an Expert
                    </Button>
                    <Button onClick={() => navigate('/order')} className="w-full justify-center shadow-lg shadow-chrimson-500/20">
                       Start Registration
                    </Button>
                 </div>
              </div>

              {/* Related Services */}
              {service.relatedServices && service.relatedServices.length > 0 && (
                 <div className="mt-8">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Related Services</h4>
                    <div className="space-y-3">
                       {service.relatedServices.map(slug => {
                          const relService = SERVICES.find(s => s.slug === slug);
                          if (!relService) return null;
                          return (
                             <Link key={slug} to={`/services/${slug}`} className="block p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-slate-100">
                                <div className="flex items-center gap-3">
                                   <relService.icon size={16} className="text-slate-400" />
                                   <span className="text-sm font-medium text-slate-700">{relService.title}</span>
                                </div>
                             </Link>
                          );
                       })}
                    </div>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};