import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getImageUrl } from '../utils/getImageUrl';

export const Preloader = () => {
  const [logoUrl, setLogoUrl] = useState('/fitis-logo-white.png');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        const res = await fetch(`${baseUrl}/api/site-settings?t=${new Date().getTime()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.header_logo_url) {
            setLogoUrl(getImageUrl(data.header_logo_url));
          }
        }
      } catch (err) {
        // Silently fallback if API isn't ready
      }
    };
    fetchSettings();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#000d1a]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
    >
      <div className="relative flex items-center justify-center">
        {/* Ripple 1 */}
        <motion.div 
          className="absolute border-2 border-fitis-blue/40 rounded-full w-32 h-32"
          animate={{ scale: [1, 3], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        {/* Ripple 2 */}
        <motion.div 
          className="absolute border-2 border-fitis-blue/40 rounded-full w-32 h-32"
          animate={{ scale: [1, 3], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
        />
        
        {/* Core pulsing aura */}
        <motion.div
          className="absolute bg-fitis-blue/30 rounded-full w-32 h-32 blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* White FITIS Logo */}
        <motion.img
          src={logoUrl}
          alt="FITIS Loading"
          className="h-16 relative z-10 object-contain drop-shadow-xl"
          onError={(e) => { e.currentTarget.src = '/fitis-logo-white.png'; }}
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};
