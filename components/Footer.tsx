import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter, ArrowRight, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { Link } from 'react-router-dom';
import { Logo } from './ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/">
               <Logo className="h-8" theme="dark" />
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Your trusted partner for business compliance in Namibia. From startup to tender-ready, we navigate the bureaucracy so you don't have to.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-chrimson-600 hover:text-white transition-all"><Linkedin size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-chrimson-600 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-chrimson-600 hover:text-white transition-all"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal & Compliance</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/terms" className="hover:text-chrimson-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-slate-600"/> Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-chrimson-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-slate-600"/> Privacy Policy</Link></li>
              <li><Link to="/refunds" className="hover:text-chrimson-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-slate-600"/> Refund Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-chrimson-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-slate-600"/> Disclaimer</Link></li>
            </ul>
          </div>

           {/* Company */}
           <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/pricing" className="hover:text-chrimson-400 transition-colors">Pricing & Packages</Link></li>
              <li><Link to="/tools" className="hover:text-chrimson-400 transition-colors">Business Tools</Link></li>
              <li><Link to="/contact" className="hover:text-chrimson-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-chrimson-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-chrimson-500 mt-1 flex-shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-chrimson-500 flex-shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-chrimson-500 flex-shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{CONTACT_INFO.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Chrimson Consultants. All rights reserved.</p>
            <div className="hidden md:block w-px h-4 bg-slate-800"></div>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-600">
              <ShieldCheck size={14} className="text-green-600" />
              Secure Payments by DPO Group
            </div>
          </div>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-slate-300">Terms</Link>
            <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};