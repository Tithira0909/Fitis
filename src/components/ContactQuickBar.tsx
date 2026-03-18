import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Phone, Mail } from 'lucide-react';

interface ContactQuickBarProps {
  site_phone?: string;
  site_email?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  youtube_url?: string;
}

export const ContactQuickBar: React.FC<ContactQuickBarProps> = ({
  site_phone,
  site_email,
  facebook_url,
  instagram_url,
  linkedin_url,
  twitter_url,
  youtube_url
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold tracking-wider text-gray-700">

        {/* Left: Call */}
        <div className="flex items-center gap-2">
          {site_phone && (
            <a href={`tel:${site_phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:text-[#00529B] transition-colors">
              <Phone size={18} className="text-[#00529B]" />
              <span>CALL NOW {site_phone}</span>
            </a>
          )}
        </div>

        {/* Center: Socials */}
        <div className="flex items-center gap-4 text-[#00529B]">
          {facebook_url && (
            <a href={facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          )}
          {instagram_url && (
            <a href={instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          )}
          {linkedin_url && (
            <a href={linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          )}
          {twitter_url && (
            <a href={twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
          )}
          {youtube_url && (
            <a href={youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label="YouTube">
              <Youtube size={20} />
            </a>
          )}
        </div>

        {/* Right: Email */}
        <div className="flex items-center gap-2">
          {site_email && (
            <a href={`mailto:${site_email}`} className="flex items-center gap-2 hover:text-[#00529B] transition-colors uppercase">
              <span>EMAIL NOW {site_email}</span>
              <Mail size={18} className="text-[#00529B]" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
};
