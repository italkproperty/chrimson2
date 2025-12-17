import React from 'react';
import { TESTIMONIALS } from '../constants';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Namibian Businesses</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            We've helped hundreds of entrepreneurs turn their ideas into compliant, registered entities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow"
            >
              <Quote className="absolute top-8 right-8 text-chrimson-100 h-12 w-12" />
              
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>
              
              <div>
                <div className="font-bold text-slate-900">{testimonial.author}</div>
                <div className="text-xs text-chrimson-600 font-semibold uppercase tracking-wide mt-1">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};