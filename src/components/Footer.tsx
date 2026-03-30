import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Globe, Mail, Phone } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

export const Footer = () => {
  const [settings, setSettings] = useState<any>({
    site_location: "No.9A, 1/3, Fourth Floor, St. Anthony’s Mawatha, Colombo 03",
    site_email: "info@fitis.lk",
    site_phone: "(+94) 112 577 103",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/site-settings?t=${new Date().getTime()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setSettings({
            site_location: data.site_location || settings.site_location,
            site_email: data.site_email || settings.site_email,
            site_phone: data.site_phone || settings.site_phone,
            footer_logo_url: data.footer_logo_url
          });
        }
      } catch (err) {
        console.error('Failed to load site settings for footer', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img src={settings.footer_logo_url ? getImageUrl(settings.footer_logo_url) : "/fitis-logo-white.png"} alt="FITIS Logo" className="h-16 md:h-20 w-auto object-contain" onError={(e) => { e.currentTarget.src = '/fitis-logo-white.png'; }} />
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
            <li><a href="#" className="hover:text-fitis-gold transition-colors">ICT Infrastructure Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Software Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Digital Services Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Education & Training Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Communication Chapter</a></li>
            <li><a href="#" className="hover:text-fitis-gold transition-colors">Digital Trust Chapter</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Contact Us</h4>
          <ul className="space-y-4 text-slate-400">
            <li className="flex gap-3">
              <Globe size={18} className="text-fitis-blue shrink-0" />
              <span>{settings.site_location}</span>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-fitis-blue shrink-0" />
              <span>{settings.site_email}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-fitis-blue shrink-0" />
              <span>{settings.site_phone}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>Copyright © {new Date().getFullYear()} FITIS Guarantee Limited.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};
