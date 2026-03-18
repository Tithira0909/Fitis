import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  Target, 
  Activity, 
  Mail, 
  Phone, 
  MapPin,
  Linkedin
} from 'lucide-react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { getImageUrl } from '../utils/getImageUrl';

export const ChapterDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/chapters/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setChapter(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !chapter) {
    return <Navigate to="/Chapter/chapters" replace />;
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <SubHeaderBar
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Chapters', href: '/Chapter/chapters' },
          { label: chapter.breadcrumb_title || chapter.name }
        ]}
        title={(chapter.hero_title || chapter.name).toUpperCase()}
        showSearch={false}
      />

      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <Link 
            to="/Chapter/chapters" 
            className="inline-flex items-center gap-2 text-fitis-blue font-bold text-sm mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Back to Chapters
          </Link>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{chapter.hero_title || chapter.name}</h1>
            <p className="text-slate-600 text-lg max-w-4xl">
              {chapter.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue">
              <Target size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Objectives</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {chapter.objectives && chapter.objectives.map((obj: any, idx: number) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="mt-1 flex-shrink-0 text-fitis-blue">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">{obj.objective_text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Summary Strip */}
      <section className="bg-fitis-blue py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
             <div className="text-white text-center md:text-left whitespace-nowrap">
               <div className="text-4xl font-black">{chapter.member_count}+</div>
               <div className="text-sm font-bold uppercase tracking-wider text-white/80">MEMBERS</div>
             </div>
             <div className="h-12 w-px bg-white/20 hidden md:block"></div>
             <p className="text-white/90 font-medium max-w-lg text-center md:text-left">
                {chapter.members_summary_text}
             </p>
          </div>
          {chapter.view_all_link && (
            <Link to={chapter.view_all_link} className="px-8 py-3 bg-white text-fitis-blue rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg whitespace-nowrap w-full md:w-auto text-center">
              VIEW ALL
            </Link>
          )}
        </div>
      </section>

      {/* Executive Committee Section */}
      {chapter.exco_members && chapter.exco_members.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Chapter Executive Committee</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {chapter.exco_members.filter((m: any) => m.status === 'active').map((member: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center h-full relative overflow-hidden group">
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-slate-50">
                    {member.image_url ? (
                       <img src={getImageUrl(member.image_url)} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl">
                          {member.name.charAt(0)}
                       </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                  <div className="text-sm text-fitis-blue font-medium mb-1">{member.designation}</div>
                  <div className="text-sm text-slate-500 mb-4">{member.company}</div>

                  <div className="mt-auto pt-4 w-full border-t border-slate-100 flex items-center justify-between">
                     <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{member.role}</span>
                     {member.linkedin_url && (
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                           <Linkedin size={18} />
                        </a>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* President's Message */}
      {(chapter.president_name || chapter.president_message_body) && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10 pb-4 border-b border-slate-200">
               <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide border-b-4 border-fitis-blue inline-block pb-4 -mb-[18px]">
                  CHAPTER PRESIDENT'S MESSAGE
               </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
               <div className="md:w-1/3 flex flex-col items-center md:items-start flex-shrink-0">
                  {chapter.president_image_url ? (
                     <img src={getImageUrl(chapter.president_image_url)} alt={chapter.president_name} className="w-full max-w-[280px] rounded-2xl shadow-md mb-6 object-cover" />
                  ) : (
                     <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-4xl mb-6 shadow-md">
                        {chapter.president_name?.charAt(0) || 'P'}
                     </div>
                  )}
                  <div className="text-center md:text-left w-full">
                     <h3 className="text-2xl font-bold text-slate-900 mb-1">{chapter.president_name}</h3>
                     <p className="text-fitis-blue font-semibold mb-1">{chapter.president_designation}</p>
                     <p className="text-slate-500 text-sm">{chapter.president_company}</p>
                  </div>
               </div>

               <div className="md:w-2/3 prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                  {chapter.president_message_body ? (
                     <div dangerouslySetInnerHTML={{ __html: chapter.president_message_body }} />
                  ) : (
                     <p className="text-slate-500 italic">Message coming soon...</p>
                  )}
               </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join {chapter.name}</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Collaborate with industry leaders and contribute to the growth of Sri Lanka's ICT sector.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-fitis-blue text-white rounded-xl font-bold text-lg hover:bg-fitis-blue-light transition-all shadow-xl active:scale-95">
              Apply for Membership
            </button>
            <Link 
              to="/Chapter/chapters"
              className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
            >
              Explore Other Chapters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
