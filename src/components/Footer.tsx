import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Globe, Mail, Phone, Youtube } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

export const Footer = () => {
  const [settings, setSettings] = useState<any>({
    site_location: "",
    site_email: "",
    site_phone: "",
  });
  const [chapters, setChapters] = useState<{name: string, slug: string}[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        const [settingsRes, chaptersRes] = await Promise.all([
          fetch(`${baseUrl}/api/site-settings?t=${new Date().getTime()}`, { cache: 'no-store' }),
          fetch(`${baseUrl}/api/chapters`)
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings({
            site_location: data.site_location || settings.site_location,
            site_email: data.site_email || settings.site_email,
            site_phone: data.site_phone || settings.site_phone,
            footer_logo_url: data.footer_logo_url,
            facebook_url: data.facebook_url,
            twitter_url: data.twitter_url,
            linkedin_url: data.linkedin_url,
            instagram_url: data.instagram_url,
          });
        }

        if (chaptersRes.ok) {
          const data = await chaptersRes.json();
          setChapters(data);
        }
      } catch (err) {
        console.error('Failed to load site settings or chapters for footer', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img src={settings.footer_logo_url ? getImageUrl(settings.footer_logo_url) : "/fitis-logo-white.png"} alt="FITIS Logo" className="h-16 md:h-20 w-auto object-contain" onError={(e) => { e.currentTarget.src = '/fitis-logo-white.png'; }} />
          </div>
          <p className="text-slate-400 leading-relaxed mb-8">
            The Federation of Information Technology Industry Sri Lanka is the apex body of the ICT industry in Sri Lanka.
          </p>
          <div className="flex gap-4">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-fitis-blue transition-colors">
                <Facebook size={18} />
              </a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-fitis-blue transition-colors">
                <Instagram size={18} />
              </a>
            )}
            {settings.linkedin_url && (
              <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-fitis-blue transition-colors">
                <Linkedin size={18} />
              </a>
            )}
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-fitis-blue transition-colors">
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="/Home/introduction" className="hover:text-fitis-gold transition-colors">About FITIS</a></li>
            <li><a href="/Home/member-benefits" className="hover:text-fitis-gold transition-colors">Membership Benefits</a></li>
            <li><a href="/Home/member-community" className="hover:text-fitis-gold transition-colors">Member Directory</a></li>
            <li><a href="/Home/events" className="hover:text-fitis-gold transition-colors">Upcoming Events</a></li>
            <li><a href="/Home/news" className="hover:text-fitis-gold transition-colors">News & Press</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Our Chapters</h4>
          <ul className="space-y-4 text-slate-400">
            {chapters.map(chapter => (
              <li key={chapter.slug}>
                <a href={`/Chapter/${chapter.slug}`} className="hover:text-fitis-gold transition-colors">
                  {chapter.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6 text-white">Contact Us</h4>
          <ul className="space-y-4 text-slate-400">
            <li className="flex gap-3">
              <Globe size={18} className="text-fitis-blue flex-shrink-0 mt-1" />
              <span className="leading-relaxed">
                {settings.site_location ? (
                  settings.site_location.split('\n').map((line: string, i: number) => (
                    <span key={i} className="block">{line}</span>
                  ))
                ) : (
                  <>
                    <span className="block">No.9A, 3/1, Fourth Floor,</span>
                    <span className="block">St. Anthony's MW,</span>
                    <span className="block">Colombo 03</span>
                  </>
                )}
              </span>
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

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center w-full text-sm text-slate-500">
        <div className="mb-6 md:mb-0 md:flex-1 text-center md:text-left w-full">
          <p>© {new Date().getFullYear()} FITIS. All Rights Reserved.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0">
          <div className="order-1 md:order-2 flex items-center justify-center w-full md:w-auto">
            <a href="https://www.zeatralabs.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity md:ml-4 md:border-l border-white/10 md:pl-6">
              <span className="text-xs tracking-wider text-slate-400">Powered by Zeatra Labs</span>
              <img src="/zeatra-white.png" alt="Zeatra Labs Logo" className="h-[25px] object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </a>
          </div>

          <div className="order-2 md:order-1 flex items-center justify-center gap-4 md:gap-8 w-full md:w-auto">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="md:hidden text-white/20">|</span>
            <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

