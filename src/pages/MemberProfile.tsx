import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Mail, Phone, Globe, Linkedin, User, Calendar, MessageSquare, Image as ImageIcon, MapPin, Hash } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';
import { SubHeaderBar } from '../components/SubHeaderBar';

interface MemberPost {
  id: number;
  content: string;
  image_url: string;
  created_at: string;
}

interface MemberDetail {
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

export const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [posts, setPosts] = useState<MemberPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        // Fetch Member Details
        const memberRes = await fetch(`${baseUrl}/api/community-members/${id}`);
        if (!memberRes.ok) throw new Error('Member not found');
        const memberData = await memberRes.json();
        setMember(memberData);

        // Fetch Posts
        const postsRes = await fetch(`${baseUrl}/api/community-members/${id}/posts`);
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMemberData();
  }, [id, baseUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <div className="text-red-500 mb-4 font-bold">Error: {error || 'Member not found'}</div>
           <Link to="/Home/member-community" className="text-blue-600 font-bold hover:underline">← Back to Community</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SubHeaderBar 
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Member Community', href: '/Home/member-community' }, { label: member.company_name }]} 
        title={member.company_name.toUpperCase()} 
        showSearch={false} 
      />

      <div className="max-w-7xl mx-auto px-4 w-full py-12 md:py-20 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar: Member Info */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-8">
          {/* Company Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 transition-all">

            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl border-2 border-slate-50 p-4 shadow-sm mb-8 mx-auto flex items-center justify-center overflow-hidden">
              {member.company_logo_url ? (
                <img src={getImageUrl(member.company_logo_url)} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-16 h-16 text-slate-200" />
              )}
            </div>
            
            <div className="text-center mb-8 border-b border-slate-50 pb-8">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{member.company_name}</h1>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-widest flex items-center gap-1.5">
                   <Hash size={12} /> {member.fitis_membership_id || 'N/A'}
                </span>
                <span className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black rounded-full border border-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                   ID: {member.company_id || 'N/A'}
                </span>
              </div>
            </div>


            <div className="space-y-6 text-slate-600">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0"><MapPin size={18} className="text-blue-500" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Company Address</p>
                  <p className="text-sm font-medium leading-relaxed">Sri Lanka HQ</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0"><Mail size={18} className="text-blue-500" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Official Email</p>
                  <a href={`mailto:${member.official_email}`} className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors break-all">{member.official_email}</a>
                </div>
              </div>

              {member.website_link && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0"><Globe size={18} className="text-blue-500" /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Website</p>
                    <a href={member.website_link} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors truncate block max-w-[200px]">{member.website_link.replace(/^https?:\/\//, '')}</a>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {member.company_linkedin && (
                  <a href={member.company_linkedin} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0077b5] text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <Linkedin size={18} /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Representative Card */}
          <div className="bg-[#0a1128] text-white rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 overflow-hidden mb-6 shadow-2xl bg-slate-800">
                {member.rep_image_url ? (
                  <img src={getImageUrl(member.rep_image_url)} alt="Rep" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User size={40} className="text-blue-500/50" /></div>
                )}
              </div>
              <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{member.rep_designation}</p>
              <h3 className="text-2xl font-black mb-3 tracking-tight">{member.rep_name}</h3>
               <div className="flex flex-col gap-3 w-full mt-6">
                <div className="flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 border border-white/10 rounded-2xl text-[13px] font-bold backdrop-blur-md transition-colors hover:bg-white/10">
                   <Mail size={16} className="text-blue-400 shrink-0" /> 
                   <span className="break-all whitespace-normal">{member.rep_email}</span>
                </div>
                {member.rep_mobile && (
                  <div className="flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 border border-white/10 rounded-2xl text-[13px] font-bold backdrop-blur-md transition-colors hover:bg-white/10">
                    <Phone size={16} className="text-blue-400 shrink-0" />
                    <span className="break-all whitespace-normal">{member.rep_mobile}</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </aside>

        {/* Main Content: Post Wall */}
        <main className="flex-1 flex flex-col gap-8">
          
          {/* Member Description / Services */}
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MessageSquare size={24} /></div>
               <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Organization Profile</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Core Business & Services</p>
               </div>
            </div>
            <div className="text-slate-600 text-lg leading-relaxed bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50 italic font-medium relative overflow-hidden">
               <span className="absolute -top-4 -left-2 text-8xl text-blue-100/50 font-serif opacity-30">"</span>
               {member.services || "This member has not provided a business description yet."}
               <span className="absolute -bottom-12 -right-2 text-8xl text-blue-100/50 font-serif opacity-30">"</span>
            </div>
          </section>

          {/* Member Wall */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                  Community Updates
               </h2>
               <span className="px-4 py-1.5 bg-white text-slate-500 font-bold text-sm rounded-full border border-slate-200 shadow-sm">{posts.length} Posts</span>
            </div>

            {posts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center shadow-lg border border-slate-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6"><MessageSquare size={40} /></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No updates yet</h3>
                <p className="text-slate-500 max-w-sm">When {member.company_name} posts an update, it will appear here on their public wall.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post, index) => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden"
                  >
                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl border border-slate-100 p-2 shrink-0 bg-white shadow-sm">
                           {member.company_logo_url ? (
                             <img src={getImageUrl(member.company_logo_url)} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                             <Building2 className="w-full h-full text-slate-200" />
                           )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg leading-tight">{member.company_name}</p>
                          <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                             <Calendar size={14} className="text-blue-500" />
                             {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="text-slate-700 text-lg leading-relaxed mb-8 whitespace-pre-wrap font-medium">
                        {post.content}
                      </div>

                      {post.image_url && (
                        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100">
                          <img src={getImageUrl(post.image_url)} alt="Wall post" className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

