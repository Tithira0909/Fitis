import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Calendar, X } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

export const Newsletters: React.FC = () => {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/newsletters`);
        if (res.ok) {
          const data = await res.json();
          setNewsletters(data);
        }
      } catch (err) {
        console.error('Failed to fetch newsletters', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, []);

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="bg-[#0a1128] py-16 px-4 relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-blue-600/30 text-blue-200 font-bold tracking-widest text-xs rounded-full mb-4 uppercase border border-blue-500/30">
            Publications
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Newsletters
          </h1>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest technological insights, industry highlights, and organizational updates from FITIS.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-fitis-blue rounded-full animate-spin" />
          </div>
        ) : newsletters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsletters.map((nl) => (
              <motion.div
                key={nl.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => window.open(getImageUrl(nl.pdf_url), '_blank')}
              >
                <div className="w-full h-64 bg-gray-100 relative overflow-hidden">
                  {nl.cover_image_url ? (
                    <img 
                      src={getImageUrl(nl.cover_image_url)} 
                      alt={nl.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                      <FileText size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 bg-white text-blue-600 rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg">
                      <Download size={24} />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-3 gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    <span>{nl.published_date ? new Date(nl.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {nl.title}
                  </h3>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:text-blue-700">
                      Read Newsletter <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Newsletters Published</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back soon for the latest organizational updates and technological insights from FITIS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
