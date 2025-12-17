import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, ShieldCheck, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-6"
          >
             <span className="text-xs font-semibold text-white tracking-wide uppercase">Our Story</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Empowering Namibian <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-chrimson-400 to-chrimson-200">Entrepreneurs</span>
          </motion.h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We simplify corporate compliance so you can focus on building your legacy.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Navigating the Red Tape</h2>
              <p className="text-lg text-slate-500 mb-6 leading-relaxed">
                Starting a business in Namibia often means dealing with complex bureaucracy at BIPA, NAMRA, and other regulatory bodies. 
                At Chrimson Consultants, we believe that compliance shouldn't be a barrier to entry.
              </p>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Founded in Windhoek, our team of legal and administrative experts has streamlined the registration process. 
                We combine deep local knowledge with modern digital tools to deliver a service that is fast, transparent, and reliable.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-4 border-chrimson-600 pl-4">
                  <div className="text-3xl font-bold text-slate-900">7-14</div>
                  <div className="text-sm text-slate-500 font-medium">Days Average Turnaround</div>
                </div>
                <div className="border-l-4 border-chrimson-600 pl-4">
                  <div className="text-3xl font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-500 font-medium">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="relative">
               <div className="absolute -inset-4 bg-chrimson-100 rounded-3xl transform rotate-3"></div>
               <img 
                 src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" 
                 alt="Team working" 
                 loading="lazy"
                 className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
              <p className="text-slate-500 mt-4">The principles that drive every consultation.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Integrity", desc: "We operate with total transparency. No hidden fees, no shortcuts." },
                { icon: Target, title: "Precision", desc: "We ensure every document is perfect to prevent delays at the registry." },
                { icon: HeartHandshake, title: "Partnership", desc: "We don't just register companies; we support your growth journey." }
              ].map((val, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                   <div className="w-14 h-14 bg-chrimson-50 text-chrimson-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <val.icon size={28} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                   <p className="text-slate-500">{val.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Meet the Team</h2>
            <p className="text-lg text-slate-500 mb-8">
               Our consultants are ready to answer your questions in English, Oshiwambo, Afrikaans, or Damara/Nama.
            </p>
            <div className="flex justify-center -space-x-4 mb-8">
               {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="Team member" loading="lazy" className="w-full h-full object-cover" />
                  </div>
               ))}
               <div className="w-12 h-12 rounded-full border-2 border-white bg-chrimson-50 text-chrimson-700 flex items-center justify-center text-xs font-bold">
                  +5
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};