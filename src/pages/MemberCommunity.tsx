import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, X, Link as LinkIcon, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  services: string;
  primary_chapter: string;
  secondary_chapter: string;
  fitis_membership_id: string;
}

export const MemberCommunity = () => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
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

  const filteredMembers = members.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      member.company_name.toLowerCase().includes(query) ||
      (member.services || '').toLowerCase().includes(query) ||
      (member.primary_chapter || '').toLowerCase().includes(query) ||
      (member.secondary_chapter || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-32 pb-20">
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

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 w-full mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search members by services, chapters, or company name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 font-medium px-2">
            <Building2 size={18} />
            <span>{filteredMembers.length} MembersFound</span>
          </div>
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
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            No community members found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8 flex flex-col items-center text-center hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-28 h-28 mb-8 rounded-3xl border-2 border-slate-50 p-4 bg-white shadow-sm flex items-center justify-center overflow-hidden group-hover:border-blue-100 group-hover:shadow-lg group-hover:shadow-blue-500/5 transition-all duration-500">
                  {member.company_logo_url ? (
                    <img src={getImageUrl(member.company_logo_url)} alt={`${member.company_name} logo`} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-12 h-12 text-slate-200" />
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight line-clamp-1">{member.company_name}</h3>
                
                <div className="flex flex-col gap-2 mb-6 w-full items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
                     Reg No: {member.company_id || 'N/A'}
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100/50">
                     FITIS ID: {member.fitis_membership_id || 'N/A'}
                   </span>
                </div>

                <div className="w-full pt-8 border-t border-slate-50 flex flex-col gap-4 mt-auto">
                   <div className="flex items-center justify-center text-slate-400 text-sm font-medium">
                      <Mail className="w-4 h-4 mr-2 text-blue-400" />
                      <span className="truncate max-w-[200px]">{member.official_email}</span>
                   </div>
                   {member.website_link && (
                     <div className="flex items-center justify-center text-slate-400 text-sm font-medium">
                        <LinkIcon className="w-4 h-4 mr-2 text-blue-400" />
                        <a href={member.website_link} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors truncate max-w-[200px]">
                          {member.website_link.replace(/^https?:\/\//, '')}
                        </a>
                     </div>
                   )}
                   
                   <Link 
                     to={`/member/${member.id}`}
                     className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20"
                   >
                      View Profile <ArrowRight size={18} />
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>




    </div>
  );
};

