import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Globe, Mail, ExternalLink } from 'lucide-react';
import Logo from '../assets/images/logo.jpeg';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img
              src={Logo}
              alt="MK Event & Media Solutions Logo"
              className="h-12 w-auto rounded-md object-contain"
            />
          </div>
          <p className="text-slate-400 leading-relaxed mb-8">
            The Federation of Information Technology Industry Sri Lanka is the apex body of the ICT industry in Sri Lanka.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-fitis-blue transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-fitis-gold transition-colors">About FITIS</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Membership Benefits</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Member Directory</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Upcoming Events</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">News & Press</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Our Chapters</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Hardware Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Software Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Education Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Communication Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Professional Chapter</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Contact Us</h4>
          <ul className="space-y-4 text-slate-400">
            <li className="flex gap-3">
              <Globe size={18} className="text-fitis-blue shrink-0" />
              <span>No. 123, Galle Road, Colombo 03, Sri Lanka.</span>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-fitis-blue shrink-0" />
              <span>info@fitis.lk</span>
            </li>
            <li className="flex gap-3">
              <ExternalLink size={18} className="text-fitis-blue shrink-0" />
              <span>+94 11 234 5678</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} FITIS. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};
