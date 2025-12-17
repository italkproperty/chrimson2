import React from 'react';
import { CONTACT_INFO } from '../constants';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { trackEvent } from '../services/analytics';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="relative bg-slate-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6"
          >
            Start Your Business Journey
          </motion.h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Ready to register? Have questions about compliance? Our team in Windhoek is ready to assist.
          </p>
        </div>
      </section>

      <section className="py-24 bg-slate-50 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-chrimson-50 flex items-center justify-center text-chrimson-600 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
                  <p className="text-slate-500 text-sm mb-2">Mon-Fri from 8am to 5pm.</p>
                  <a 
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
                    onClick={() => trackEvent('contact_click', { method: 'phone' })}
                    className="text-chrimson-600 font-semibold"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-chrimson-50 flex items-center justify-center text-chrimson-600 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-slate-500 text-sm mb-2">We typically reply within 2 hours.</p>
                  <a 
                    href={`mailto:${CONTACT_INFO.email}`} 
                    onClick={() => trackEvent('contact_click', { method: 'email' })}
                    className="text-chrimson-600 font-semibold"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-chrimson-50 flex items-center justify-center text-chrimson-600 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Visit Us</h3>
                  <p className="text-slate-500 text-sm mb-2">{CONTACT_INFO.address}</p>
                  <a 
                    href={CONTACT_INFO.mapLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={() => trackEvent('contact_click', { method: 'map' })}
                    className="text-chrimson-600 font-semibold text-sm underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
              <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  trackEvent('contact_click', { method: 'form_submit' });
                  alert("Message Sent!");
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-chrimson-500 focus:border-transparent outline-none transition-all" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-chrimson-500 focus:border-transparent outline-none transition-all" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-chrimson-500 focus:border-transparent outline-none transition-all" placeholder="john@company.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service Interested In</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-chrimson-500 focus:border-transparent outline-none transition-all bg-white">
                    <option>Pty Ltd Registration</option>
                    <option>NAMFISA Compliance</option>
                    <option>NTB Registration</option>
                    <option>Good Standing / Tax</option>
                    <option>Other Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-chrimson-500 focus:border-transparent outline-none transition-all" placeholder="Tell us about your business needs..."></textarea>
                </div>

                <Button className="w-full md:w-auto px-8" size="lg">Send Message</Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};