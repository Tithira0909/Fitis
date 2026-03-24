import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, X, Link as LinkIcon, Mail, User, Phone } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

interface CommunityMember {
  id: number;
  company_name: string;
  company_logo_url: string;
  company_id: string;
  official_email: string;
  company_linkedin: string;
  website_link: string;
  rep_image_url: string;
  rep_name: string;
  rep_email: string;
  rep_mobile: string;
  rep_designation: string;
}

export const MemberCommunity = () => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/community-members`);
        if (!res.ok) throw new Error('Failed to fetch community members');
        const data = await res.json();
        setMembers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0a1128] text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-600/30 text-blue-200 font-bold tracking-widest text-xs rounded-full mb-4 uppercase border border-blue-500/30">Community Directory</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">FITIS Member Community</h1>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            Discover and connect with the innovative organizations driving Sri Lanka's digital transformation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full mt-12 relative z-20">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium bg-red-50 rounded-2xl border border-red-100">
            {error}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            No community members found at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedMember(member)}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-24 h-24 mb-6 rounded-2xl border-2 border-gray-50 p-2 bg-white shadow-sm flex items-center justify-center overflow-hidden group-hover:border-blue-100 transition-colors">
                  {member.company_logo_url ? (
                    <img src={getImageUrl(member.company_logo_url)} alt={`${member.company_name} logo`} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.company_name}</h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                  ID: {member.company_id || 'N/A'}
                </span>
                <div className="mt-auto w-full pt-6 border-t border-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{member.official_email}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Details */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-gray-900 shadow-sm transition"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto w-full">
                {/* Modal Header */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex flex-col md:flex-row items-center border-b border-gray-100 text-center md:text-left">
                  <div className="w-28 h-28 rounded-2xl bg-white border border-gray-200 p-3 shadow-md mb-6 md:mb-0 md:mr-8 flex-shrink-0 flex items-center justify-center">
                    {selectedMember.company_logo_url ? (
                        <img src={getImageUrl(selectedMember.company_logo_url)} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedMember.company_name}</h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 shadow-sm">ID: {selectedMember.company_id || 'N/A'}</span>
                      {selectedMember.website_link && (
                        <a href={selectedMember.website_link} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full transition">
                          <LinkIcon size={14} className="mr-1.5" /> Website
                        </a>
                      )}
                      {selectedMember.company_linkedin && (
                        <a href={selectedMember.company_linkedin} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full transition">
                          <LinkIcon size={14} className="mr-1.5" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                  <div className="mb-10">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Official Contact</h3>
                    <div className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <Mail className="w-5 h-5 mr-3 text-blue-500" />
                      <span className="font-medium text-lg">{selectedMember.official_email}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Primary Representative</h3>
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                      <div className="w-20 h-20 rounded-full border border-gray-200 overflow-hidden bg-gray-100 mb-4 md:mb-0 md:mr-6 flex-shrink-0 flex items-center justify-center">
                        {selectedMember.rep_image_url ? (
                          <img src={getImageUrl(selectedMember.rep_image_url)} alt="Rep" className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedMember.rep_name}</h4>
                        <p className="text-blue-600 font-medium mb-4">{selectedMember.rep_designation}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-center md:justify-start text-sm text-gray-600 bg-gray-50 py-2 px-3 rounded-lg border border-gray-100">
                            <Mail size={16} className="mr-2 text-gray-400" />
                            <span className="truncate">{selectedMember.rep_email}</span>
                          </div>
                          <div className="flex items-center justify-center md:justify-start text-sm text-gray-600 bg-gray-50 py-2 px-3 rounded-lg border border-gray-100">
                            <Phone size={16} className="mr-2 text-gray-400" />
                            <span>{selectedMember.rep_mobile}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
