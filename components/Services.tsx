import React from 'react';
import { SERVICES } from '../constants';
import { motion } from 'framer-motion';
import { Reveal } from './ui/Reveal';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal>
            <h2 className="text-base text-chrimson-600 font-semibold tracking-wide uppercase mb-2">Our Expertise</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to operate legally.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-slate-500">We navigate the complexities of Namibian corporate law so you don't have to.</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.1}>
              <Link to={`/services/${service.slug}`} className="block h-full">
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                  className="group relative p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-chrimson-100 transition-all duration-300 overflow-hidden h-full flex flex-col"
                >
                  {/* Card Hover Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-chrimson-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-chrimson-600 mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <service.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-chrimson-700 transition-colors group-hover:font-extrabold">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                      {service.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/50 flex items-center text-sm font-semibold text-chrimson-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Learn More <ArrowRight size={16} className="ml-2" />
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};