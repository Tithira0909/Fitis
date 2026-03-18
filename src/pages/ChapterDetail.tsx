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
  Linkedin,
  MapPin 
} from 'lucide-react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { chaptersData } from '../data/chapters';

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL}${url}`;
};

// Types to mirror our new database structure
interface ChapterData {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
  icon_url: string;
  summary: string;
  objectives_json: string;
  description_html: string;
  chair_name: string;
  chair_title: string;
  contact_email: string;
  contact_phone: string;
  about_html: string;
  president_name: string;
  president_title: string;
  president_company: string;
  president_photo_url: string;
  president_message_html: string;
  member_count_manual: number;
  member_count_text: string;
  member_count_link: string;
}

interface CommitteeMember {
  id: number;
  name: string;
  designation: string;
  company: string;
  role_badge: string;
  photo_url: string;
  linkedin_url: string;
}

export const ChapterDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Find fallback local data for icon
  const localChapterData = chaptersData.find(c => c.slug === slug);
  const Icon = localChapterData?.icon || Users;

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Chapter
        const resChapter = await fetch(`${import.meta.env.VITE_API_URL}/api/chapters/${slug}`);
        if (!resChapter.ok) {
          throw new Error('Chapter not found');
        }
        const chapterData = await resChapter.json();
        setChapter(chapterData);

        // 2. Fetch Committee
        const resCommittee = await fetch(`${import.meta.env.VITE_API_URL}/api/chapters/${slug}/committee`);
        if (resCommittee.ok) {
          const committeeData = await resCommittee.json();
          setCommittee(committeeData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchChapterData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-12 h-12 border-4 border-fitis-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !chapter) {
    return <Navigate to="/Chapter/chapters" replace />;
  }

  // Parse objectives safely
  let objectives: string[] = [];
  try {
    objectives = chapter.objectives_json ? JSON.parse(chapter.objectives_json) : [];
  } catch (e) {
    console.error("Failed to parse objectives JSON", e);
  }

  return (
    <div className="bg-white min-h-screen pb-0">

      {/* Main Subheader */}
      <SubHeaderBar
        breadcrumbs={[
          { label: 'HOME', href: '/' },
          { label: 'CHAPTERS', href: '/Chapter/chapters' },
          { label: chapter.name.toUpperCase() }
        ]}
        title={chapter.name.toUpperCase()}
        showSearch={false}
      />

      {/* Top Section Layout: About (Left) and Objectives (Right) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* LEFT: About */}
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-slate-800 uppercase tracking-wide">
                ABOUT THE {chapter.name.toUpperCase()}
              </h2>
              {chapter.about_html ? (
                <div
                  className="text-slate-600 leading-relaxed text-base prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: chapter.about_html }}
                />
              ) : chapter.description_html ? (
                <div
                  className="text-slate-600 leading-relaxed text-base prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: chapter.description_html }}
                />
              ) : (
                <p className="text-slate-500 italic">No description available.</p>
              )}
            </div>

            {/* RIGHT: Objectives */}
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-slate-800 uppercase tracking-wide">
                OBJECTIVES
              </h2>
              {objectives.length > 0 ? (
                <ul className="space-y-4 text-slate-600">
                  {objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-slate-800 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span dangerouslySetInnerHTML={{ __html: obj }}></span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">No objectives listed.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER PRESIDENT'S MESSAGE Section */}
      {(chapter.president_message_html || chapter.president_photo_url) && (
        <section className="py-0 mb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#0f2c4a] text-white py-3 px-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold tracking-wide">CHAPTER PRESIDENT'S MESSAGE</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
              {chapter.president_photo_url && (
                <div className="flex-shrink-0 w-full md:w-64 lg:w-80">
                  <img
                    src={getImageUrl(chapter.president_photo_url)}
                    alt={chapter.president_name || 'President'}
                    className="w-full h-auto rounded shadow-sm object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {chapter.president_name && (
                    <div className="text-center mt-4">
                      <p className="font-bold text-slate-800 text-lg">{chapter.president_name}</p>
                      <p className="text-slate-500 text-sm">{chapter.president_title}</p>
                      <p className="text-slate-500 text-xs">{chapter.president_company}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1">
                {chapter.president_message_html ? (
                  <div
                    className="text-slate-700 leading-relaxed text-[15px] prose max-w-none prose-p:mb-6"
                    dangerouslySetInnerHTML={{ __html: chapter.president_message_html }}
                  />
                ) : (
                  <p className="text-slate-500 italic">Message coming soon.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Members Summary Band */}
      {/* Either manual count or committee count */}
      {((chapter.member_count_manual && chapter.member_count_manual > 0) || committee.length > 0) && (
        <section className="bg-[#0f2c4a] py-12 border-y border-[#1a3a5c]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">

              <div className="flex items-center gap-6">
                <div className="text-5xl lg:text-7xl font-light text-[#4a90e2]">
                  {chapter.member_count_manual || committee.length}
                </div>
                <div className="text-xl lg:text-2xl font-light tracking-wider uppercase">
                  MEMBERS
                </div>
              </div>

              <div className="flex-1 text-center md:text-left text-blue-100 max-w-2xl px-4 lg:px-8 text-sm lg:text-base border-l border-r border-[#1a3a5c]">
                {chapter.member_count_text || `Join the thriving network of the ${chapter.name}. Leverage our platform to accelerate your growth and industry impact.`}
              </div>

              <div className="flex-shrink-0">
                {chapter.member_count_link ? (
                  <a
                    href={chapter.member_count_link}
                    className="px-8 py-3 border-2 border-[#4a90e2] text-white hover:bg-[#4a90e2] hover:text-white transition-all rounded font-medium tracking-wide uppercase text-sm inline-block"
                  >
                    View All
                  </a>
                ) : (
                  <Link
                    to="/Home/become-a-member"
                    className="px-8 py-3 border-2 border-[#4a90e2] text-white hover:bg-[#4a90e2] hover:text-white transition-all rounded font-medium tracking-wide uppercase text-sm inline-block"
                  >
                    Join Us
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Chapter Executive Committee Section */}
      {committee && committee.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-light text-slate-800 text-center mb-16 uppercase tracking-wide">
              Chapter Executive Committee
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {committee.map((member) => (
                <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-start gap-5 relative group">

                  {/* Photo */}
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden relative border-2 border-white shadow-sm">
                    {member.photo_url ? (
                      <img
                        src={getImageUrl(member.photo_url)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0f2c4a&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0f2c4a] text-white flex items-center justify-center font-bold text-xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 pr-6">
                    <h4 className="font-bold text-slate-900 text-[15px] mb-1 leading-tight">{member.name}</h4>
                    <p className="text-fitis-blue text-xs font-semibold mb-1 uppercase tracking-wide">{member.designation}</p>
                    <p className="text-slate-500 text-xs">{member.company}</p>
                  </div>

                  {/* Role Badge Overlay */}
                  {member.role_badge && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-200">
                      {member.role_badge}
                    </div>
                  )}

                  {/* LinkedIn */}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-4 right-4 text-slate-300 hover:text-[#0077b5] transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}

                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fallback Contact / Original Footer Area */}
      {(!committee || committee.length === 0) && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Join the {chapter.name}</h2>
            <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
              Collaborate with industry leaders and contribute to the growth of Sri Lanka's ICT sector.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/Home/become-a-member"
                className="w-full sm:w-auto px-10 py-4 bg-fitis-blue text-white rounded-xl font-bold text-lg hover:bg-fitis-blue-light transition-all shadow-xl active:scale-95"
              >
                Apply for Membership
              </Link>
              <Link
                to="/Chapter/chapters"
                className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
              >
                Explore Other Chapters
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
