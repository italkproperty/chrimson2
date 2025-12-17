import React from 'react';
import { TIMELINE } from '../constants';
import { motion } from 'framer-motion';

export const ProcessTimeline: React.FC = () => {
  return (
    <section id="process" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Registration Journey</h2>
            <p className="text-lg text-slate-500">Transparent, predictable, and managed entirely by us.</p>
        </div>

        <div className="relative">
          {/* Vertical Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2"></div>

          <div className="space-y-12 relative">
            {TIMELINE.map((step, index) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content Side */}
                <div className="w-full md:w-[calc(50%-2rem)] p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                       <span className="text-xs font-semibold px-2 py-1 bg-chrimson-50 text-chrimson-700 rounded-full">{step.duration}</span>
                   </div>
                   <p className="text-slate-600">{step.description}</p>
                </div>

                {/* Dot */}
                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-chrimson-600 shadow-[0_0_0_4px_white]">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>

                {/* Empty Side for Layout Balance */}
                <div className="hidden md:block w-[calc(50%-2rem)]"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};